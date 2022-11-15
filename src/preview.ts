import { execSync } from 'child_process';
import { basename } from 'path';
import path = require('path');
import {
    commands,
    Disposable,
    ExtensionContext,
    TextDocument,
    TextDocumentChangeEvent,
    TextEditor,
    ViewColumn,
    WebviewPanel,
    window,
    workspace,
} from 'vscode';

import { fixImages, getCWD, isMJMLFile, mjmlToHtml } from './helper';

type TRenderEngineResponse = {
    html: string;
    errors: Array<TRenderEngineError>;
}
type TRenderEngineError = {
    line: number;
    message: string;
    tagName: string;
    formattedMessage: string;
}

export default class Preview {
    private openedDocuments: TextDocument[] = []
    private previewOpen: boolean = false
    private subscriptions: Disposable[]
    private webview: WebviewPanel | undefined

    constructor(context: ExtensionContext) {
        this.subscriptions = context.subscriptions

        this.subscriptions.push(
            commands.registerCommand('mjml.previewToSide', () => {
                if (window.activeTextEditor) {
                    this.previewOpen = true
                    this.displayWebView(window.activeTextEditor.document)
                } else {
                    window.showErrorMessage("Active editor doesn't show a MJML document.")
                }
            }),

            workspace.onDidOpenTextDocument((document?: TextDocument) => {
                if (
                    document &&
                    this.previewOpen &&
                    workspace.getConfiguration('mjml').autoPreview
                ) {
                    this.displayWebView(document)
                }
            }),

            window.onDidChangeActiveTextEditor((editor?: TextEditor) => {
                if (editor && this.previewOpen && workspace.getConfiguration('mjml').autoPreview) {
                    this.displayWebView(editor.document)
                }
            }),

            workspace.onDidChangeTextDocument((event?: TextDocumentChangeEvent) => {
                if (
                    event &&
                    this.previewOpen &&
                    workspace.getConfiguration('mjml').updateWhenTyping
                ) {
                    this.displayWebView(event.document)
                }
            }),

            workspace.onDidSaveTextDocument((document?: TextDocument) => {
                if (document && this.previewOpen) {
                    this.displayWebView(document)
                }
            }),

            workspace.onDidCloseTextDocument((document?: TextDocument) => {
                if (document && this.previewOpen && this.webview) {
                    this.removeDocument(document.fileName)

                    if (
                        this.openedDocuments.length === 0 &&
                        workspace.getConfiguration('mjml').autoClosePreview
                    ) {
                        this.dispose()
                    }
                }
            }),
        )
    }

    public dispose(): void {
        if (this.webview !== undefined) {
            this.webview.dispose()
        }
    }

    private displayWebView(document: TextDocument): void {
        if (!isMJMLFile(document)) {
            return
        }

        const activeTextEditor: TextEditor | undefined = window.activeTextEditor
        if (!activeTextEditor || !activeTextEditor.document) {
            return
        }

        const content: string = this.getContent(document)
        
        const label: string = `MJML Preview - ${basename(activeTextEditor.document.fileName)}`

        if (!this.webview) {
            this.webview = window.createWebviewPanel('mjml-preview', label, ViewColumn.Two, {
                retainContextWhenHidden: true,
            })

            this.webview.webview.html = content

            this.webview.onDidDispose(
                () => {
                    this.webview = undefined
                    this.previewOpen = false
                },
                null,
                this.subscriptions,
            )

            if (workspace.getConfiguration('mjml').preserveFocus) {
                // Preserve focus of Text Editor after preview open
                window.showTextDocument(activeTextEditor.document, ViewColumn.One)
            }
        } else {
            this.webview.title = label
            this.webview.webview.html = content
        }
    }

    /**
     * given a TRenderEngineResponse, returns string-formatted HTML to be rendered
     */
    private getRenderedContent(res: TRenderEngineResponse): string {
        const errors = () => res.errors.map((err) => err.formattedMessage ?? err.message ?? (err.line && err.tagName ? `An error occurred on line ${err.line}:<${err.tagName}>` : "There were errors, but your render engine did not return a valid message")).join("\n\n");
        
        if (res.errors && res.errors.length > 0) return errors();
        
        return res.html;
    }

    private getContent(document: TextDocument): string {
        if (!workspace.getConfiguration('mjml').switchOnSeparateFileChange) {
            document = this.openedDocuments[0] || document
        }

        const getHtml = (document: TextDocument) => {
            return mjmlToHtml(
                this.wrapInMjmlTemplate(document.getText()),
                false,
                false,
                document.uri.fsPath,
                'skip',
            ).html
        }

        // html is the final HTML that will be rendered
        // renderedContent is the HTML returned by the custom render engine
        let html: string, renderedContent: string | undefined = undefined;

        // if the workspace is configured with a render engine, use that
        if (workspace.getConfiguration('mjml').rendererPath) {
            const workspaceDir = workspace.workspaceFolders![0].uri.path;
            const rendererPath = workspace.getConfiguration('mjml').rendererPath;
            
            const renderer = path.isAbsolute(rendererPath) ? rendererPath : path.join(workspaceDir, workspace.getConfiguration('mjml').rendererPath);
            
            const directory = path.dirname(document.uri.fsPath);

            const content = document.getText();
            const payload = {
                directory,
                content,
                filePath: document.uri.fsPath,
                options: {
                    mjmlConfigPath: getCWD(document.uri.fsPath)
                }
            }

            const stdout =  execSync(`node ${renderer} ${JSON.stringify(payload)}`, {
                input: JSON.stringify(payload)
            }).toString();
            const result: TRenderEngineResponse = JSON.parse(stdout);

            renderedContent = this.getRenderedContent(result);
        }

        html = renderedContent ?? getHtml(document);

        if (html) {
            // only add this document if there is no render engine
            if (!renderedContent) this.addDocument(document)
            return this.setBackgroundColor(fixImages(html, document.uri.fsPath))
        }

        return this.error("Active editor doesn't show a MJML document.")
    }

    private wrapInMjmlTemplate(documentText:string): string {
        if (documentText.trim().startsWith('<mjml')) {
            return documentText
        }

        return "<mjml><mj-body>" + documentText + "</mj-body></mjml>"
    }

    private setBackgroundColor(html: string): string {
        if (workspace.getConfiguration('mjml').previewBackgroundColor) {
            const tmp: RegExpExecArray | null = /<.*head.*>/i.exec(html)

            if (tmp && tmp[0]) {
                html = html.replace(
                    tmp[0],
                    `${tmp[0]}\n<style>
                    html, body { background-color: ${
                        workspace.getConfiguration('mjml').previewBackgroundColor
                    }; }
                </style>`,
                )
            }
        }

        return html
    }

    private error(error: string): string {
        return `<body>${error}</body>`
    }

    private addDocument(document: TextDocument): void {
        if (this.openedDocuments.indexOf(document) === -1) {
            this.openedDocuments.push(document)
        }
    }

    private removeDocument(fileName: string): void {
        this.openedDocuments = this.openedDocuments.filter(
            (file: TextDocument) => file.fileName !== fileName,
        )
    }
}
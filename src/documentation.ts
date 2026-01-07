import * as fs from 'fs'
import { existsSync, readFileSync, statSync } from 'fs'
import { join as joinPath } from 'path'
import * as path from 'path'
import {
  commands,
  ExtensionContext,
  TextDocument,
  TextEditor,
  Uri,
  ViewColumn,
  WebviewPanel,
  window,
  workspace,
} from 'vscode'

export default class Documentation {
  private context: ExtensionContext
  private webview: WebviewPanel | undefined
  private webviewViewColumn: ViewColumn | undefined

  constructor(context: ExtensionContext) {
    this.context = context
    this.webviewViewColumn = ViewColumn.Two

    context.subscriptions.push(
      commands.registerCommand('mjml.documentation', () => {
        this.displayWebView()
      }),

      commands.registerCommand('mjml.searchInDocumentation', () => {
        this.searchInDocumentation()
      }),
    )
  }

  public dispose(): void {
    if (this.webview !== undefined) {
      this.webview.dispose()
      this.webviewViewColumn = ViewColumn.Two
    }
  }

  private displayWebView(): void {
    if (!this.webview) {
      const documentationPath: string = path.join(__dirname, '../documentation/documentation.html')
      if (
        !documentationPath ||
        !fs.existsSync(documentationPath) ||
        !fs.statSync(documentationPath).isFile()
      ) {
        return
      }

      this.webview = window.createWebviewPanel(
        'mjml-documentation',
        'MJML Documentation',
        ViewColumn.Two,
        {
          enableFindWidget: true,
          enableScripts: true,
          localResourceRoots: [Uri.parse(this.context.extensionPath)],
          retainContextWhenHidden: true,
        },
      )

      const html = fs.readFileSync(documentationPath, 'utf8')
      const rootUri = this.webview.webview.asWebviewUri(
        Uri.file(path.join(__dirname, '../documentation')),
      )
      const htmlWithImages = html.replace(/{{root}}/g, rootUri.toString())
      this.webview.webview.html = htmlWithImages

      this.webview.onDidChangeViewState(() => {
        if (this.webview && this.webviewViewColumn !== this.webview.viewColumn) {
          this.webviewViewColumn = this.webview.viewColumn
        }
      })

      this.webview.onDidDispose(() => {
        this.webview = undefined
        this.webviewViewColumn = ViewColumn.Two
      })
    }

    this.webview.reveal(this.webviewViewColumn)

    this.handleEvents()
  }

  private handleEvents(): void {
    if (this.webview) {
      // Handle messages from the webview
      this.webview.webview.onDidReceiveMessage(
        (message: WebviewMessage) => {
          if (message.command === 'openExample') {
            this.openExample(message.data)
          }
        },
        undefined,
        this.context.subscriptions,
      )
    }
  }

  private searchInDocumentation(): void {
    const activeTextEditor: TextEditor | undefined = window.activeTextEditor
    if (!activeTextEditor) {
      return
    }

    // Get selected text and clean it
    const text: string = activeTextEditor.document.getText(activeTextEditor.selection)
    const raw = text.replace(/<|>/g, '').trim()
    let anchor = raw.startsWith('mj-') ? `#${raw}` : `#mj-${raw}`

    this.displayWebView()
    if (this.webview) {
      this.webview.webview.postMessage({
        anchor,
        command: 'scrollTo',
      })
    }
  }

  private async openExample(fileName: string): Promise<void> {
    const filePath: string = joinPath(__dirname, '../documentation/examples/', `${fileName}.mjml`)

    if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
      const document: TextDocument = await workspace.openTextDocument({
        content: readFileSync(filePath, 'utf8'),
        language: 'mjml',
      })

      await window.showTextDocument(document, {
        viewColumn: ViewColumn.One,
      })

    }
  }

}

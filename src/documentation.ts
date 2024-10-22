import { existsSync, readFileSync, statSync } from 'fs'
import { join as joinPath } from 'path'
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
  private content: string = ''
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
      const documentationPath: string = joinPath(__dirname, '../documentation/documentation.html')
      if (
        !documentationPath ||
        !existsSync(documentationPath) ||
        !statSync(documentationPath).isFile()
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

      this.webview.webview.html = this.getWebviewContent(documentationPath)

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

  private getWebviewContent(filePath: string): string {
    if (!this.content) {
      const rootPath: string = Uri.parse(joinPath(this.context.extensionPath, 'documentation'))
        .with({
          scheme: 'vscode-resource',
        })
        .toString()

      this.content = readFileSync(filePath)
        .toString()
        .replace(/{{root}}/gi, rootPath)
    }

    return this.content
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

    const text: string = activeTextEditor.document.getText(activeTextEditor.selection)
    let anchor: string = text
      .replace(/((\/|\<|\>)|^\s+|(\r?\n|\r)|\s.*)/gi, '')
      .replace('mj-', '#mjml-')
    if (!anchor.startsWith('#mjml-')) {
      anchor = `#mjml-${anchor}`
    }

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

      await commands.executeCommand('mjml.previewToSide')
    }
  }
}

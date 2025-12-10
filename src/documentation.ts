import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import {
  commands,
  ExtensionContext,
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
    const examplePath = path.join(__dirname, '../documentation/examples/', `${fileName}.mjml`)

    if (fs.existsSync(examplePath) && fs.statSync(examplePath).isFile()) {
      // Create a temp file path
      const tempFilePath = path.join(os.tmpdir(), `${fileName}-${Date.now()}.mjml`)
      // Copy the example to the temp file
      fs.copyFileSync(examplePath, tempFilePath)

      // Open the temp file in the editor
      const document = await workspace.openTextDocument(tempFilePath)
      await window.showTextDocument(document, {
        viewColumn: ViewColumn.One,
        preview: false,
      })

      await commands.executeCommand('mjml.previewToSide')
    }
  }
}

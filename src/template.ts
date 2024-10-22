import { existsSync, readFileSync, statSync } from 'fs'
import { join as joinPath } from 'path'
import {
  commands,
  ExtensionContext,
  ProgressLocation,
  TextDocument,
  TextEditor,
  TextEditorEdit,
  Uri,
  ViewColumn,
  WebviewPanel,
  window,
  workspace,
} from 'vscode'

export default class Template {
  private context: ExtensionContext
  private templateList: Templates[] = []
  private webview: WebviewPanel | undefined
  private webviewViewColumn: ViewColumn | undefined

  constructor(context: ExtensionContext) {
    this.context = context

    context.subscriptions.push(
      commands.registerCommand('mjml.template', () => {
        this.fetchTemplates()
      }),
    )
  }

  private async fetchTemplates(): Promise<void> {
    if (workspace.getConfiguration('mjml').templateGallery && this.webview) {
      this.webview.reveal(this.webviewViewColumn)

      return
    }

    if (!this.templateList) {
      return
    }

    this.templateList = await window.withProgress(
      {
        cancellable: false,
        location: ProgressLocation.Notification,
        title: 'Fetching templates...',
      },
      async () => {
        const response = await fetch(
          'https://api.github.com/repos/mjmlio/email-templates/git/trees/master?recursive=1',
        )
        const { tree } = (await response.json()) as any

        if (!tree) {
          window.showErrorMessage('Error occurred while fetching templates list.')

          return
        }

        return await tree.reduce((map: any, item: any) => {
          const extract: RegExpExecArray | null = /.*\/([^.]*)\..*/.exec(item.path)
          if (
            !item.path.startsWith('templates/') &&
            !item.path.startsWith('thumbnails/') &&
            !extract
          ) {
            return map
          }

          if (extract && extract[1]) {
            const templateName: string | null = extract[1]
            if (!map[templateName]) {
              map[templateName] = {}
            }

            const path: string = `https://raw.githubusercontent.com/mjmlio/email-templates/master/${item.path}`

            if (item.path.endsWith('.mjml')) {
              map[templateName].mjml = path
              map[templateName].name = templateName
            } else {
              map[templateName].thumbnail = path
            }

            return map
          }
        }, {})
      },
    )

    if (workspace.getConfiguration('mjml').templateGallery) {
      this.displayWebView()
    } else {
      this.quickPick()
    }
  }

  private quickPick(): void {
    window
      .showQuickPick(Object.keys(this.templateList), {
        placeHolder: 'Choose a template',
      })
      .then((selected: string | undefined) => {
        if (!selected) {
          return
        }

        this.createFile((this.templateList as any)[selected].mjml, true)
      })
  }

  private displayWebView(): void {
    if (!this.webview) {
      this.webviewViewColumn = ViewColumn.One

      this.webview = window.createWebviewPanel('mjml-templates', 'MJML Templates', ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [Uri.parse(this.context.extensionPath)],
        retainContextWhenHidden: true,
      })

      let html: string = ''
      for (const item in this.templateList) {
        if (!this.templateList.hasOwnProperty(item)) {
          continue
        }

        html += `
                <div class="template"
                style="background-image:url('${this.templateList[item].thumbnail}');"
                onclick="createFile('${this.templateList[item].mjml}');">
                    <div class="name">${this.templateList[item].name}</div>
                </div>`
      }

      const galleryPath: string = joinPath(__dirname, '../resources/templates/gallery.html')

      if (!galleryPath || !existsSync(galleryPath) || !statSync(galleryPath).isFile()) {
        return
      }

      this.webview.webview.html = readFileSync(galleryPath, 'utf8').replace('{{templates}}', html)

      this.webview.onDidChangeViewState(() => {
        if (this.webview && this.webviewViewColumn !== this.webview.viewColumn) {
          this.webviewViewColumn = this.webview.viewColumn
        }
      })

      this.webview.onDidDispose(() => {
        this.webview = undefined
        this.webviewViewColumn = ViewColumn.One
      })
    }

    this.handleEvents()
  }

  private handleEvents(): void {
    if (this.webview) {
      // Handle messages from the webview
      this.webview.webview.onDidReceiveMessage(
        (message: WebviewMessage) => {
          if (message.command === 'createFile') {
            this.createFile(message.data, false)
          }
        },
        undefined,
        this.context.subscriptions,
      )
    }
  }

  private createFile(templateURL: string, activeEditor: boolean): void {
    fetch(templateURL)
      .then((response: any) => {
        if (response.status === 200) {
          return response.text()
        }
      })
      .then(async (body: string) => {
        if (body) {
          if (activeEditor) {
            const activeTextEditor: TextEditor | undefined = window.activeTextEditor
            if (!activeTextEditor) {
              return
            }

            activeTextEditor.edit((editBuilder: TextEditorEdit) => {
              editBuilder.insert(activeTextEditor.selection.active, body)
            })
          } else {
            const document: TextDocument = await workspace.openTextDocument({
              content: body,
              language: 'mjml',
            })

            await window.showTextDocument(document, {
              viewColumn: ViewColumn.One,
            })

            if (workspace.getConfiguration('mjml').templateGalleryAutoClose && this.webview) {
              this.webview.dispose()
            }
          }
        } else {
          window.showErrorMessage('Error occurred while fetching template.')
        }
      })
  }
}

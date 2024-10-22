import { writeFile } from 'fs'
import { basename, resolve as resolvePath } from 'path'
import { commands, Disposable, Uri, window, workspace } from 'vscode'

import { getPath, renderMJML } from './helper'

export default class Export {
  constructor(subscriptions: Disposable[]) {
    subscriptions.push(
      commands.registerCommand('mjml.exportHTML', () => {
        this.export()
      }),
    )
  }

  private export(): void {
    renderMJML((content: string) => {
      const defaultFileName: string = basename(getPath()).replace(/\.[^\.]+$/, '')

      let exportType: string = workspace.getConfiguration('mjml').exportType
      if (!exportType.startsWith('.')) {
        exportType = `.${exportType}`
      }

      if (workspace.getConfiguration('mjml').showSaveDialog) {
        window
          .showSaveDialog({
            defaultUri: Uri.file(resolvePath(getPath(), `../${defaultFileName}${exportType}`)),
            filters: {
              'All files': ['*'],
              HTML: ['html'],
            },
          })
          .then((fileUri: Uri | undefined) => {
            if (fileUri) {
              this.writeFile(fileUri.fsPath, content)
            }
          })
      } else {
        window
          .showInputBox({
            placeHolder: `Enter a filename (${defaultFileName}${exportType} or .xyz).`,
            prompt: 'Filename',
            value: defaultFileName + exportType,
          })
          .then((fileName: string | undefined) => {
            if (!fileName) {
              return
            }

            if (!/[.]/.exec(fileName)) {
              fileName += exportType
            }

            if (fileName.startsWith('.')) {
              fileName = defaultFileName + fileName
            }

            this.writeFile(resolvePath(getPath(), `../${fileName}`), content)
          })
      }
    })
  }

  private writeFile(file: string, content: string): void {
    writeFile(file, content, (error: NodeJS.ErrnoException | null) => {
      if (error) {
        window.showErrorMessage(`Could not save the file: ${error.message}`)
      } else {
        window.showInformationMessage(`File saved as ${basename(file)}`)
      }
    })
  }
}

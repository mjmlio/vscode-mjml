import { existsSync, readFileSync, statSync } from 'fs'
import { join as joinPath } from 'path'
import { commands, Disposable, window } from 'vscode'

export default class Version {
  constructor(subscriptions: Disposable[]) {
    subscriptions.push(
      commands.registerCommand('mjml.version', () => {
        this.version()
      }),
    )
  }

  private version(): void {
    const filePath: string = joinPath(__dirname, '../node_modules/mjml/package.json')

    if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
      try {
        const data: any = JSON.parse(readFileSync(filePath, 'utf8'))
        window.showInformationMessage(`MJML version: ${data.version}`)
      } catch (error) {
        if (error instanceof Error) {
          window.showErrorMessage(error.message)
        } else {
          window.showErrorMessage(
            'An unknown error occurred while reading the MJML version: ' + error,
          )
        }
      }
    }
  }
}

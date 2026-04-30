import { commands, Disposable, window } from 'vscode'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mjmlVersion: string = require('mjml/package.json').version

export default class Version {
  constructor(subscriptions: Disposable[]) {
    subscriptions.push(
      commands.registerCommand('mjml.version', () => {
        this.version()
      }),
    )
  }

  private version(): void {
    window.showInformationMessage(`MJML version: ${mjmlVersion}`)
  }
}

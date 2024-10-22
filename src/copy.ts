import { commands, Disposable, window, env } from 'vscode'

import { renderMJML } from './helper'

export default class Copy {
  constructor(subscriptions: Disposable[]) {
    subscriptions.push(
      commands.registerCommand('mjml.copyHTML', () => {
        this.copy()
      }),
    )
  }

  private copy(): void {
    renderMJML((content: string) => {
      env.clipboard.writeText(content).then(() => {
        window.showInformationMessage('Copied!')
      })
    })
  }
}

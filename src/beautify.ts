import { commands, Disposable, Position, Range, TextDocument, TextEditor, window, workspace } from 'vscode'

import { isMJMLFile } from './helper'
import prettier from 'prettier'

export default class Beautify {
  constructor(subscriptions: Disposable[]) {
    subscriptions.push(
      commands.registerCommand('mjml.beautify', () => {
        this.beautify()
      }),
    )
  }

  private async beautify(): Promise<void> {
    const activeTextEditor: TextEditor | undefined = window.activeTextEditor

    if (activeTextEditor && isMJMLFile(activeTextEditor.document)) {
      let formattedDocument: string | undefined
      try {
        const prettierrcConfig = await prettier.resolveConfig(activeTextEditor.document.fileName)

        const vsCodeConfig = workspace.getConfiguration('mjml').beautify

        const defaultConfig = {
          parser: 'html',
          printWidth: 240,
          singleQuote: true,
        }

        formattedDocument = await prettier.format(activeTextEditor.document.getText(), {
          ...defaultConfig,
          ...vsCodeConfig,
          ...prettierrcConfig,
        })
      } catch (error) {
        window.showErrorMessage(
          'Beautify failed: ' + (error instanceof Error ? error.message : String(error)),
        )
        return
      }

      activeTextEditor.edit((editBuilder) => {
        if (formattedDocument) {
          editBuilder.replace(getRange(activeTextEditor.document), formattedDocument)
        }
      })
    } else {
      window.showWarningMessage('This is not a MJML document!')
      return
    }
  }
}

function getRange(document: TextDocument): Range {
  return new Range(
    new Position(0, 0),
    new Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length),
  )
}

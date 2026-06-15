import { commands, Disposable, languages, Position, Range, TextDocument, TextEdit, TextEditor, window, workspace } from 'vscode'

import { isMJMLFile } from './helper'
import prettier from 'prettier'

export default class Beautify {
  constructor(subscriptions: Disposable[]) {
    subscriptions.push(
      commands.registerCommand('mjml.beautify', () => {
        this.beautify()
      }),
      languages.registerDocumentFormattingEditProvider('mjml', {
        provideDocumentFormattingEdits: async (document: TextDocument): Promise<TextEdit[]> => {
          try {
            const formatted = await this.formatDocument(document)
            return [TextEdit.replace(getRange(document), formatted)]
          } catch (error) {
            window.showErrorMessage(
              'Beautify failed: ' + (error instanceof Error ? error.message : String(error)),
            )
            return []
          }
        },
      }),
    )
  }

  private async formatDocument(document: TextDocument): Promise<string> {
    const prettierrcConfig = await prettier.resolveConfig(document.fileName)
    const vsCodeConfig = workspace.getConfiguration('mjml').beautify
    const defaultConfig = {
      parser: 'html',
      printWidth: 80,
      singleQuote: true,
    }
    const finalConfig = {
      ...defaultConfig,
      ...vsCodeConfig,
      ...prettierrcConfig,
    }
    return prettier.format(document.getText(), finalConfig)
  }

  private async beautify(): Promise<void> {
    const activeTextEditor: TextEditor | undefined = window.activeTextEditor

    if (activeTextEditor && isMJMLFile(activeTextEditor.document)) {
      let formattedDocument: string | undefined
      try {
        formattedDocument = await this.formatDocument(activeTextEditor.document)
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

import {
  Diagnostic,
  DiagnosticCollection,
  DiagnosticSeverity,
  Disposable,
  languages,
  Position,
  Range,
  TextDocument,
  TextDocumentChangeEvent,
  TextEditor,
  window,
  workspace,
} from 'vscode'

import { getPath, mjmlToHtml } from './helper'

export default class Linter {
  private diagnosticCollection!: DiagnosticCollection

  constructor(subscriptions: Disposable[]) {
    if (workspace.getConfiguration('mjml').lintEnable) {
      this.diagnosticCollection = languages.createDiagnosticCollection('mjml')

      subscriptions.push(
        this.diagnosticCollection,

        window.onDidChangeActiveTextEditor((editor?: TextEditor) => {
          if (editor && editor.document) {
            this.lintDocument(editor.document)
          }
        }),

        workspace.onDidChangeTextDocument((event?: TextDocumentChangeEvent) => {
          if (event && event.document && workspace.getConfiguration('mjml').lintWhenTyping) {
            this.lintDocument(event.document)
          }
        }),

        workspace.onDidCloseTextDocument((document?: TextDocument) => {
          if (document) {
            this.diagnosticCollection.delete(document.uri)
          }
        }),

        workspace.onDidOpenTextDocument((document?: TextDocument) => {
          if (document) {
            this.lintDocument(document)
          }
        }),

        workspace.onDidSaveTextDocument((document?: TextDocument) => {
          if (document) {
            this.lintDocument(document)
          }
        }),
      )

      // Lint all open mjml documents
      workspace.textDocuments.forEach(this.lintDocument, this)
    }
  }

  public dispose(): void {
    this.diagnosticCollection.clear()
    this.diagnosticCollection.dispose()
  }

  private async lintDocument(textDocument: TextDocument): Promise<void> {
    if (textDocument.languageId !== 'mjml') {
      return
    }

    const diagnostics: Diagnostic[] = []

    try {
      const { errors }: any = await mjmlToHtml(
        textDocument.getText(),
        false,
        false,
        getPath(),
        'strict',
        workspace.getConfiguration('mjml').mjmlConfigPath,
      )

      if (errors && errors[0]) {
        errors[0].errors.forEach((error: any) => {
          const line: number = error.line - 1
          const currentLine: string = textDocument.lineAt(line).text

          diagnostics.push(
            new Diagnostic(
              new Range(
                new Position(line, currentLine.indexOf('<')),
                new Position(line, currentLine.length),
              ),
              error.message,
              DiagnosticSeverity.Error,
            ),
          )
        })
      }

      this.diagnosticCollection.set(textDocument.uri, diagnostics)
    } catch (error) {
      this.diagnosticCollection.set(textDocument.uri, diagnostics)
    }
  }
}

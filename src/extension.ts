import { ExtensionContext } from 'vscode'

import Completion from './completion'
import Copy from './copy'
import Documentation from './documentation'
import Email from './email'
import Export from './export'
import Linter from './linter'
import Preview from './preview'
import Template from './template'
import Version from './version'

let context: ExtensionContext
let extensionFeatures: object[] = []

export function activate(extensionContext: ExtensionContext) {
  context = extensionContext

  extensionFeatures = [
    new Completion(context.subscriptions),
    new Copy(context.subscriptions),
    new Documentation(context),
    new Email(context.subscriptions),
    new Export(context.subscriptions),
    new Linter(context.subscriptions),
    new Preview(context),
    new Template(context),
    new Version(context.subscriptions),
  ]
}

export function deactivate() {
  for (const feature of extensionFeatures) {
    if (typeof (feature as any).dispose === 'function') {
      ;(feature as any).dispose()
    }
  }

  for (const subscription of context.subscriptions) {
    subscription.dispose()
  }
}

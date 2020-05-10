import {
  window,
  workspace,
  ExtensionContext,
} from 'vscode';
import CircleCI from './models/circleci';
import { registerCommands } from './commands';
import { CircleCIContentProvider } from './providers';

let circleci: CircleCI;

export async function activate(context: ExtensionContext) {
  circleci = new CircleCI(context);

  window.registerTreeDataProvider('circleciPipeline', circleci);
  workspace.registerTextDocumentContentProvider(
    'circleci',
    new CircleCIContentProvider()
  );

  registerCommands(circleci);
}

export function deactivate() {
  circleci.dispose();
}

import { window, ExtensionContext } from 'vscode';
import CircleCI from './models/circleci';
import { registerCommands } from './commands';

let circleci: CircleCI;

export async function activate(context: ExtensionContext) {
  circleci = new CircleCI(context);

  window.registerTreeDataProvider('circleciPipeline', circleci);

  registerCommands(circleci);
}

export function deactivate() {
  circleci.dispose();
}

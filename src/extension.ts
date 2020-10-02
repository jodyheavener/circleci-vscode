import { window, workspace, ExtensionContext } from 'vscode';
import config from './lib/config';
import gitService from './lib/git-service';
import ArtifactContentProvider from './lib/artifact-content-provider';
import CircleCITree from './lib/circleci-tree';
import registerCommands from './lib/commands';

let circleciTree: CircleCITree;
let exportedContext: ExtensionContext;

export async function activate(context: ExtensionContext): Promise<void> {
  const git = await gitService();
  exportedContext = context;

  function refresh(): void {
    circleciTree.refresh();
  }

  config().onChange(refresh);
  git.onChange(refresh);

  circleciTree = new CircleCITree(git);
  window.registerTreeDataProvider('circleciTree', circleciTree);

  workspace.registerTextDocumentContentProvider(
    'circle-artifact',
    new ArtifactContentProvider()
  );

  registerCommands(circleciTree);
}

export function deactivate(): void {
  circleciTree && circleciTree.dispose();
}

export function getContext(): ExtensionContext {
  return exportedContext;
}

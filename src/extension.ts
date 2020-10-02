import { window, workspace, ExtensionContext } from 'vscode';
import config from './lib/config';
import gitService from './lib/git-service';
import ArtifactContentProvider from './lib/artifact-content-provider';
import PipelinesTree from './lib/pipelines-tree';
import registerCommands from './lib/commands';

let pipelinesTree: PipelinesTree;
let exportedContext: ExtensionContext;

export async function activate(context: ExtensionContext): Promise<void> {
  const git = await gitService();
  exportedContext = context;

  function refresh(): void {
    pipelinesTree.refresh();
  }

  config().onChange(refresh);
  git.onChange(refresh);

  pipelinesTree = new PipelinesTree(git);
  window.registerTreeDataProvider('circleciPipelinesTree', pipelinesTree);

  workspace.registerTextDocumentContentProvider(
    'circle-artifact',
    new ArtifactContentProvider()
  );

  registerCommands(pipelinesTree);
}

export function deactivate(): void {
  pipelinesTree && pipelinesTree.dispose();
}

export function getContext(): ExtensionContext {
  return exportedContext;
}

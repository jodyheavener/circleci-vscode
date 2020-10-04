import { window, workspace, ExtensionContext } from 'vscode';
import constants from './lib/constants';
import config from './lib/config';
import gitService from './lib/git-service';
import ArtifactContentProvider from './lib/artifact-content-provider';
import PipelinesTree from './lib/pipelines-tree';
import registerCommands from './lib/commands';
import { l } from './lib/localize';

let pipelinesTree: PipelinesTree;
let exportedContext: ExtensionContext;

export async function activate(context: ExtensionContext): Promise<void> {
  if (!workspace.workspaceFolders || !workspace.workspaceFolders.length) {
    return void window.showInformationMessage(
      l(
        'activationMessage',
        'CircleCI will activate when a folder is added to your Workspace'
      )
    );
  }

  const git = await gitService();
  exportedContext = context;

  function refresh(): void {
    pipelinesTree.refresh();
  }

  config().onChange(refresh);
  git.onChange(refresh);

  pipelinesTree = new PipelinesTree(git);
  window.registerTreeDataProvider(
    constants.PIPELINES_TREE_VIEW_ID,
    pipelinesTree
  );

  workspace.registerTextDocumentContentProvider(
    constants.TEXT_ARTIFACT_PROVIDER_SCHEME,
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

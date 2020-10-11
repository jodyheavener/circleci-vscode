import { window, workspace, ExtensionContext, Disposable } from 'vscode';
import constants from './lib/constants';
import config from './lib/config';
import gitService from './lib/git-service';
import ArtifactContentProvider from './lib/artifact-content-provider';
import PipelinesTree from './lib/pipelines-tree';
import registerGlobalCommands from './lib/global-commands';
import { l } from './lib/utils';

let pipelinesTree: PipelinesTree;
let exportedContext: ExtensionContext;
let globalCommands: Disposable[];

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

  globalCommands = registerGlobalCommands(pipelinesTree);
}

export function deactivate(): void {
  pipelinesTree && pipelinesTree.dispose();
  globalCommands.forEach(command => command.dispose());
}

export function getContext(): ExtensionContext {
  return exportedContext;
}

import { ExtensionContext, window } from 'vscode';
import registerCommands from './lib/commands';
import { PIPELINES_TREE_ID } from './lib/constants';
import { extension } from './lib/extension';
import ProjectTreeDataProvider from './lib/project-tree-data-provider';

export const activate = async (context: ExtensionContext): Promise<void> => {
  await extension.configure(context);

  const pipelinesTree = new ProjectTreeDataProvider();
  window.registerTreeDataProvider(PIPELINES_TREE_ID, pipelinesTree);

  context.subscriptions.push(...registerCommands(pipelinesTree));
};

export const deactivate = (): void => {
  // Nothing to do here
};

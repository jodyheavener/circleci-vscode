import { ExtensionContext, window } from 'vscode';
import registerCommands from './lib/commands';
import { PIPELINES_TREE_ID } from './lib/constants';
import { extension } from './lib/extension';
import PipelineTreeDataProvider from './lib/pipeline-tree-data-provider';
import { ProjectStatusBar } from './lib/project-status-bar';

export const activate = async (context: ExtensionContext): Promise<void> => {
  extension.configure(context);

  new ProjectStatusBar(context);

  const pipelinesTree = new PipelineTreeDataProvider();
  window.registerTreeDataProvider(PIPELINES_TREE_ID, pipelinesTree);

  context.subscriptions.push(...registerCommands(pipelinesTree));
};

export const deactivate = (): void => {
  // Nothing to do here
};

import { ExtensionContext, window } from 'vscode';
import { PIPELINES_TREE_ID } from './lib/constants';
import extension from './lib/extension';
import PipelineTreeDataProvider from './lib/pipeline-tree-data-provider';

export const activate = async (context: ExtensionContext): Promise<void> => {
  extension.configure(context);

  window.registerTreeDataProvider(
    PIPELINES_TREE_ID,
    new PipelineTreeDataProvider()
  );
};

export const deactivate = (): void => {
  // Nothing to do here
};

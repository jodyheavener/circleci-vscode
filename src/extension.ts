import { window, workspace, ExtensionContext } from 'vscode';
import CircleCI from 'circle-client';
import Config from './lib/config';
import GitMonitor from './lib/git-monitor';
import ArtifactContentProvider from './lib/artifact-content-provider';
import CircleCITree from './lib/circleci-tree';
import registerCommands from './lib/commands';
import { ConfigItems } from './lib/types';

let circleciTree: CircleCITree;

export async function activate(context: ExtensionContext): Promise<void> {
  function getClient(): CircleCI {
    const apiToken = config.get('apiToken') as string;

    if (!apiToken) {
      window.showErrorMessage(
        'A CircleCI API token (`circleci.apiToken`) must be set.'
      );
    }

    return new CircleCI(apiToken, gitMonitor.circleProjectSlug);
  }

  function refresh(): void {
    circleciTree.client = getClient();
    circleciTree.refresh();
  }

  const config = new Config();
  config.onChange(refresh);

  const gitMonitor = new GitMonitor();
  await gitMonitor.setup(
    config.get('VCSProvider') as ConfigItems['VCSProvider']
  );
  gitMonitor.onChange(refresh);

  circleciTree = new CircleCITree(context, getClient(), config, gitMonitor);
  window.registerTreeDataProvider('circleciTree', circleciTree);

  workspace.registerTextDocumentContentProvider(
    'circle-artifact',
    new ArtifactContentProvider()
  );

  registerCommands();
}

export function deactivate(): void {
  circleciTree && circleciTree.dispose();
}

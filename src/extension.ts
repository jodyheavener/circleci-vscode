import {
  window,
  workspace,
  ExtensionContext,
  Disposable,
  extensions,
} from 'vscode';
import constants from './lib/constants';
import config, { reset as resetConfig } from './lib/config';
import gitService, { reset as resetService } from './lib/git-service';
import { reset as resetClient } from './lib/circle-client';
import ArtifactContentProvider from './lib/artifact-content-provider';
import PipelinesTree from './lib/pipelines-tree';
import registerGlobalCommands from './lib/global-commands';
import WelcomeWebView from './views/welcome-webview';
import UpgradeWebView from './views/upgrade-webview';
import { splitVersion } from './lib/utils';

let pipelinesTree: PipelinesTree;
let exportedContext: ExtensionContext;
let globalCommands: Disposable[];

export async function activate(context: ExtensionContext): Promise<void> {
  // context.globalState.update(constants.EXTENSION_VERSION, undefined); // REMOVE ME

  const extension = extensions.getExtension(constants.QUALIFIED_EXTENSION_ID)!;
  const currentVersion = extension.packageJSON.version;
  const previousVersion = context.globalState.get<string>(
    constants.EXTENSION_VERSION
  );

  migrateConfig(currentVersion, previousVersion);

  if (!workspace.workspaceFolders || !workspace.workspaceFolders.length) {
    // FIXME: This was getting annoying. Maybe we can
    // re-enable with a different approach later.
    //
    // return void window.showInformationMessage(
    //   l(
    //     'activationMessage',
    //     'CircleCI will activate when a folder is added to your Workspace'
    //   )
    // );
    return;
  }

  const git = await gitService();
  exportedContext = context;

  function refresh(): void {
    resetConfig();
    resetService();
    resetClient();
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

  showStartupView(currentVersion, previousVersion);
  context.globalState.update(constants.EXTENSION_VERSION, currentVersion);
}

export function deactivate(): void {
  pipelinesTree && pipelinesTree.dispose();
  globalCommands.forEach((command) => command.dispose());
}

function migrateConfig(
  currentVersion: string,
  previousVersion: string | undefined
): void {
  // FIXME: This needs some fine tuning
  return;

  if (currentVersion === previousVersion) {
    return;
  }

  const [currentMajor, currentMinor] = splitVersion(currentVersion);

  if (currentMajor >= 0) {
    // 0.2.0 moved to circleci-vscode namespace
    if (currentMinor >= 2) {
      config().migrate(
        {
          apiToken: 'apiToken',
          customBranches: 'customBranches',
          pipelineRefreshInterval: 'pipelineReloadInterval',
          buildRefreshInterval: 'workflowReloadInterval',
        },
        'circleci'
      );
    }
  }
}

async function showStartupView(
  currentVersion: string,
  previousVersion: string | undefined
): Promise<void> {
  const welcomeWebView = new WelcomeWebView(currentVersion);
  const upgradeWebView = new UpgradeWebView(currentVersion);

  if (previousVersion === undefined) {
    return welcomeWebView.show();
  }

  const [currentMajor, currentMinor] = splitVersion(currentVersion);
  const [previousMajor, previousMinor] = splitVersion(previousVersion);

  // Don't do anything if...
  if (
    // The versions are the same major and minor
    (currentMajor === previousMajor && currentMinor === previousMinor) ||
    // A major downgrade occurred
    currentMajor < previousMajor ||
    // A minor downgrade occurred
    (currentMajor === previousMajor && currentMinor < previousMinor)
  ) {
    return;
  }

  // Show upgrade view if...
  if (
    // A major upgrade occurred
    currentMajor !== previousMajor ||
    // A minor upgrade occurred
    (currentMajor === previousMajor && currentMinor > previousMinor)
  ) {
    upgradeWebView.show();
  }
}

export function getContext(): ExtensionContext {
  return exportedContext;
}

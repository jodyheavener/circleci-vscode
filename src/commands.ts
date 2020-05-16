import { commands } from 'vscode';
import CircleCI from './models/circleci';
import Pipeline from './models/pipeline';
import Build, {
  BuildCommit,
  BuildWorkflow,
  BuildArtifacts,
  BuildArtifact,
} from './models/build';

export const registerCommands = (circleci: CircleCI) => {
  commands.registerCommand('circleci.openPipelinesPage', () => {
    circleci.openPage();
  });

  commands.registerCommand('circleci.refreshAll', () => {
    circleci.hardRefresh();
  });

  commands.registerCommand('circleci.remove', (item: Pipeline) => {
    item.remove();
  });

  commands.registerCommand('circleci.refresh', (item: Pipeline | Build) => {
    item.refresh();
  });

  commands.registerCommand('circleci.openPage', (item: Pipeline | Build) => {
    item.openPage();
  });

  commands.registerCommand('circleci.retryBuild', (item: Build) => {
    item.retry();
  });

  commands.registerCommand('circleci.cancelBuild', (item: Build) => {
    item.cancel();
  });

  commands.registerCommand('circleci.copyBuildNumber', (item: Build) => {
    item.copyBuildNumber();
  });

  commands.registerCommand('circleci.copyCommitHash', (item: BuildCommit) => {
    item.copyCommitHash();
  });

  commands.registerCommand('circleci.copyWorkflowId', (item: BuildWorkflow) => {
    item.copyWorkflowId();
  });

  commands.registerCommand(
    'circleci.buildFetchArtifacts',
    (item: BuildArtifacts) => {
      item.fetchArtifacts();
    }
  );

  commands.registerCommand(
    'circleci.downloadArtifact',
    (item: BuildArtifact) => {
      item.downloadArtifact();
    }
  );
};

import { commands } from 'vscode';
import CircleCI from './models/circleci';
import Build, { BuildCommit } from './models/build';
import Pipeline from './models/pipeline';

export const registerCommands = (circleci: CircleCI) => {
  commands.registerCommand('circleci.refreshAll', () => {
    circleci.hardRefresh();
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
};

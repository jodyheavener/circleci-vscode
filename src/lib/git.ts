import { window, workspace } from 'vscode';
import userName from 'git-username';
import branchName from 'git-branch';
import repoName from 'git-repo-name';

export function getUserName(): string {
  try {
    const name = userName(workspace.rootPath);
    return name!.split(':')[1] || name!;
  } catch (error) {
    window.showErrorMessage(`Could not retrieve Git remote user name.`);
    throw new Error(error);
  }
}

export function getRepoName(): string {
  try {
    return repoName.sync(workspace.rootPath);
  } catch (error) {
    window.showErrorMessage(`Could not retrieve Git remote repo name.`);
    throw new Error(error);
  }
}

export function getBranchName(): string {
  try {
    return branchName.sync(workspace.rootPath);
  } catch (error) {
    window.showErrorMessage(`Could not retrieve Git remote branch name.`);
    throw new Error(error);
  }
}

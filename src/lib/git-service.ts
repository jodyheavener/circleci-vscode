import { watchFile } from 'fs';
import { join } from 'path';
import { window, workspace } from 'vscode';
import config from './config';
import { ConfigItems, ConfigKey, GitSet } from './types';
import { execCommand, l, stripNewline } from './utils';

const REPO_MATCHER = /(?:git@.*\..*:|https?:\/\/.*\..*\/)(.*)\/(.*).git/g;
let exportedService: GitService | null = null;

export class GitService {
  gitData?: GitSet;
  rootPath: string;

  private changeCallback?: () => void;

  constructor(public vcs: ConfigItems['VcsProvider']) {
    this.rootPath = workspace.workspaceFolders![0].uri.fsPath;
  }

  async setup(): Promise<void> {
    try {
      const { user, repo } = await this.getRepoInfo();
      this.gitData = {
        user,
        repo,
        branch: await this.getBranch(),
        vcs: this.vcs,
      };

      watchFile(join(this.rootPath, '.git/HEAD'), async () => {
        await this.observeBranchChanges();
      });
    } catch (error) {
      this.showErrorMessage(error);
      console.error(error);
    }
  }

  onChange(callback: () => void): void {
    this.changeCallback = callback;
  }

  get circleProjectSlug(): string {
    return [this.vcs, this.user, this.repo].join('/');
  }

  get user(): string {
    return this.gitData!.user;
  }

  get repo(): string {
    return this.gitData!.repo;
  }

  get branch(): string {
    return this.gitData!.branch;
  }

  private async observeBranchChanges(): Promise<void> {
    try {
      const newBranch = await this.getBranch();

      if (this.gitData!.branch != newBranch) {
        this.gitData!.branch = newBranch;
        this.changeCallback && this.changeCallback();
      }
    } catch (error) {
      this.showErrorMessage(error);
      console.error(error);
    }
  }

  private showErrorMessage(error: string | Error): void {
    const message = typeof error === 'string' ? error : error.message;
    window.showErrorMessage(message);
  }

  private async getRepoInfo(): Promise<{ user: string; repo: string }> {
    try {
      const cmdOutput = stripNewline(
        await execCommand('git config --get remote.origin.url', this.rootPath)
      );
      const matches = [...cmdOutput.matchAll(REPO_MATCHER)];
      return { user: matches[0][1], repo: matches[0][2] };
    } catch (error) {
      console.error(error);
      throw l(
        'badGitInfo',
        'Could not retrieve Git info. Is the "origin" remote set?'
      );
    }
  }

  private async getBranch(): Promise<string> {
    try {
      const cmdOutput = stripNewline(
        await execCommand('git rev-parse --abbrev-ref HEAD', this.rootPath)
      );
      return cmdOutput;
    } catch (error) {
      console.error(error);
      throw l('badGitBranch', 'Could not retrieve Git branch.');
    }
  }
}

export function reset(): void {
  exportedService = null;
}

export default async function gitService(): Promise<GitService> {
  if (!exportedService) {
    exportedService = new GitService(
      config().get(ConfigKey.VcsProvider) as ConfigItems['VcsProvider']
    );
    await exportedService.setup();
  }

  return exportedService;
}

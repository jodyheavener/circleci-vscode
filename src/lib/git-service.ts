import { StatWatcher, watchFile } from 'fs';
import { join } from 'path';
import { workspace } from 'vscode';
import { client } from './circleci';
import { configuration } from './config';
import { events } from './events';
import {
  ActivatableGitData,
  ConfigItems,
  ConfigKey,
  Events,
  GitData,
} from './types';
import { execCommand, stripNewline } from './utils';

const REPO_MATCHER = /(?:git@.*\..*:|https?:\/\/.*\..*\/)(.*)\/(.*).git/g;

class GitService {
  private gitWatcher?: StatWatcher;
  private rootPath?: string;
  private watchedBranches: string[] = [];
  data?: GitData;

  constructor() {
    this.setup();
    events.on(Events.ConfigChange, this.configChange.bind(this));
  }

  async setup(): Promise<void> {
    if (this.gitWatcher) {
      this.gitWatcher.removeAllListeners();
    }

    this.rootPath = workspace.workspaceFolders![0].uri.fsPath;
    this.watchedBranches = configuration.get<string[]>(
      ConfigKey.WatchedBranches
    );
    const vcs = configuration.get<ConfigItems[ConfigKey.VcsProvider]>(
      ConfigKey.VcsProvider
    );

    try {
      const { user, repo } = await this.getRepoInfo();
      this.data = {
        user,
        repo,
        branch: await this.getBranch(),
        vcs,
      };

      client.projectSlug = this.circleSlug;

      this.gitWatcher = watchFile(
        join(this.rootPath, '.git/HEAD'),
        this.branchChange.bind(this)
      );
    } catch (error: any) {
      console.error(error);
      throw new Error('Error setting up Git watcher.');
    }
  }

  private configChange(): void {
    const vcs = configuration.get<ConfigItems[ConfigKey.VcsProvider]>(
      ConfigKey.VcsProvider
    );
    const watchedBranches = configuration.get<string[]>(
      ConfigKey.WatchedBranches
    );

    let fireUpdate = false;

    if (this.data.vcs != vcs) {
      this.data.vcs = vcs;
      client.projectSlug = this.circleSlug;
      fireUpdate = true;
    }

    if (
      watchedBranches.length !== this.watchedBranches.length ||
      watchedBranches.some((branch) => !this.watchedBranches.includes(branch))
    ) {
      this.watchedBranches = watchedBranches;
      fireUpdate = true;
    }

    if (fireUpdate) {
      events.fire(Events.GitDataUpdate);
    }
  }

  private async branchChange(): Promise<void> {
    try {
      const newBranch = await this.getBranch();

      if (this.data.branch != newBranch) {
        this.data.branch = newBranch;
        events.fire(Events.GitDataUpdate);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error observing branch changes.');
    }
  }

  private async getRepoInfo(): Promise<{ user: string; repo: string }> {
    try {
      const cmdOutput = stripNewline(
        execCommand('git config --get remote.origin.url', this.rootPath)
      );
      const matches = [...cmdOutput.matchAll(REPO_MATCHER)];
      return { user: matches[0][1], repo: matches[0][2] };
    } catch (error) {
      console.error(error);
      throw new Error('Could not retrieve Git info.');
    }
  }

  private async getBranch(): Promise<string> {
    try {
      return stripNewline(
        execCommand('git rev-parse --abbrev-ref HEAD', this.rootPath)
      );
    } catch (error) {
      console.error(error);
      throw new Error('Could not retrieve Git branch.');
    }
  }

  get sets(): ActivatableGitData[] {
    return [...new Set([this.data.branch, ...this.watchedBranches])].map(
      (branch) => ({
        branch,
        user: this.data.user,
        repo: this.data.repo,
        vcs: this.data.vcs,
        active: branch === this.data.branch,
      })
    );
  }

  get circleSlug(): string {
    return [this.data.vcs, this.data.user, this.data.repo].join('/');
  }
}

export const gitService = new GitService();

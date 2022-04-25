import { watchFile } from 'fs';
import { join } from 'path';
import { client } from './circleci';
import { configuration } from './config';
import { events } from './events';
import { extension } from './extension';
import {
  ConfigKey,
  Events,
  GitBranch,
  ProjectData,
  VcsProvider,
} from './types';
import { execCommand, forConfig, stripNewline } from './utils';

const REPO_MATCHER = /(?:git@(.*)\..*:|https?:\/\/(.*)\..*\/)(.*)\/(.*).git/g;

class GitService {
  private watchedBranches: string[] = [];
  currentBranch: string;
  data: ProjectData;

  async configure(): Promise<void> {
    this.watchedBranches = configuration.get<string[]>(
      ConfigKey.BranchesToWatch
    );

    await this.setGitData();

    events.on(
      Events.ConfigChange,
      forConfig(
        ConfigKey.BranchesToWatch,
        this.watchedBranchesChange.bind(this)
      )
    );

    watchFile(
      join(extension.workspacePath, '.git/HEAD'),
      this.branchChange.bind(this)
    );
  }

  private watchedBranchesChange(branches: string[]): void {
    this.watchedBranches = branches;
    events.fire(Events.GitDataUpdate);
  }

  private async branchChange(): Promise<void> {
    try {
      const newBranch = await this.getBranch();

      if (this.currentBranch != newBranch) {
        this.currentBranch = newBranch;
        events.fire(Events.GitDataUpdate);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error observing branch changes.');
    }
  }

  private async getBranch(): Promise<string> {
    try {
      return stripNewline(
        execCommand('git rev-parse --abbrev-ref HEAD', extension.workspacePath)
      );
    } catch (error) {
      console.error(error);
      throw new Error('Could not retrieve Git branch.');
    }
  }

  private async setGitData(): Promise<void> {
    const gitRemote = configuration.get<string>(ConfigKey.GitRemote);

    try {
      const cmdOutput = stripNewline(
        execCommand(
          `git config --get remote.${gitRemote}.url`,
          extension.workspacePath
        )
      );
      const [_, vcsSSH, vcsHTTPS, user, repo] = [
        ...cmdOutput.matchAll(REPO_MATCHER),
      ][0];
      const vcs = vcsSSH ?? vcsHTTPS;

      // @ts-expect-error - value of vcs may not be a
      // VcsProvider, that's why we're checking
      if (!Object.values(VcsProvider).includes(vcs)) {
        throw new Error(`Unknown VCS provider: ${vcs}`);
      }

      this.data = { vcs, user, repo } as ProjectData;
      this.currentBranch = await this.getBranch();

      client.slug = this.circleSlug;
    } catch (error) {
      console.error(error);
      throw new Error('Could not retrieve Git info.');
    }
  }

  get branches(): GitBranch[] {
    return [...new Set([this.currentBranch, ...this.watchedBranches])].map(
      (name) => ({
        name,
        active: name === this.currentBranch,
      })
    );
  }

  get circleSlug(): string {
    return [this.data.vcs, this.data.user, this.data.repo].join('/');
  }
}

export const gitService = new GitService();

import {
  Disposable,
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
} from 'vscode';
import Pipeline from '../views/pipeline';
import config from './config';
import constants from './constants';
import { GitService } from './git-service';
import { ActivatableGitSet, ConfigKey } from './types';
import { interpolate, openInBrowser } from './utils';

export default class PipelinesTree
  implements TreeDataProvider<TreeItem>, Disposable
{
  private disposed = false;
  private refreshing = true;
  private pipelines: Pipeline[] = [];
  private _onDidChangeTreeData: EventEmitter<Pipeline | undefined> =
    new EventEmitter<Pipeline | undefined>();
  readonly onDidChangeTreeData: Event<Pipeline | undefined> =
    this._onDidChangeTreeData.event;

  constructor(private git: GitService) {}

  disposePipelines(): void {
    this.pipelines.forEach((pipeline) => {
      pipeline.dispose();
    });
  }

  dispose(): void {
    this.disposePipelines();
    this.disposed = true;
  }

  refreshPipeline(pipeline: Pipeline): void {
    this._onDidChangeTreeData.fire(pipeline);
  }

  refresh(): void {
    this.refreshing = true;
    this.disposePipelines();
    this._onDidChangeTreeData.fire(undefined);
  }

  reload(): void {
    this.refresh();
  }

  openPage(): void {
    openInBrowser(
      interpolate(constants.PROJECT_URL, {
        vcs: this.git.vcs,
        user: this.git.user,
        repo: this.git.repo,
      })
    );
  }

  private getBranchSets(): ActivatableGitSet[] {
    return [
      ...new Set([
        this.git.branch,
        ...(config().get(ConfigKey.CustomBranches) as string[]),
      ]),
    ].map((branch) => ({
      branch,
      user: this.git.user,
      repo: this.git.repo,
      vcs: this.git.vcs,
      current: branch === this.git.branch,
    }));
  }

  getTreeItem(element: Pipeline): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: Pipeline | undefined): ProviderResult<TreeItem[]> {
    if (!element) {
      if (this.refreshing && !this.disposed) {
        this.pipelines = this.getBranchSets().map(
          (branchSet) => new Pipeline(branchSet, this)
        );

        this.refreshing = false;
      }

      return this.pipelines;
    }

    return element.children;
  }
}

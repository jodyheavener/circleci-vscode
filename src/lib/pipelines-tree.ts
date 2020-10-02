import {
  Disposable,
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
} from 'vscode';
import config from './config';
import { GitService } from './git-service';
import { ActivatableGitSet } from './types';
import { openInBrowser } from './utils';
import Pipeline from '../views/Pipeline';

export default class PipelinesTree
  implements TreeDataProvider<TreeItem>, Disposable {
  private disposed = false;
  private refreshing = true;
  private pipelines: Pipeline[] = [];
  private _onDidChangeTreeData: EventEmitter<
    Pipeline | undefined
  > = new EventEmitter<Pipeline | undefined>();
  readonly onDidChangeTreeData: Event<Pipeline | undefined> = this
    ._onDidChangeTreeData.event;

  constructor(private git: GitService) {}

  dispose(): void {
    this.disposed = true;
  }

  refreshPipeline(pipeline: Pipeline): void {
    this._onDidChangeTreeData.fire(pipeline);
  }

  refresh(): void {
    this.refreshing = true;
    this._onDidChangeTreeData.fire(undefined);
  }

  reload(): void {
    this.refresh();
  }

  openPage(): void {
    openInBrowser(
      `https://app.circleci.com/pipelines/${encodeURIComponent(
        this.git.vcs
      )}/${encodeURIComponent(this.git.user)}/${encodeURIComponent(
        this.git.repo
      )}`
    );
  }

  private getBranchSets(): ActivatableGitSet[] {
    return [
      ...new Set([
        this.git.branch,
        ...(config().get('customBranches') as string[]),
      ]),
    ].map((branch) => ({
      branch,
      user: this.git.user,
      repo: this.git.repo,
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

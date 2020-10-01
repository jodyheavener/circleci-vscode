import {
  Disposable,
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
} from 'vscode';
import CircleCI from 'circle-client';
import Config from './config';
import GitMonitor from './git-monitor';
import { ActivatableGitSet } from './types';
import Pipeline from '../views/Pipeline';

export default class CircleCITree
  implements TreeDataProvider<TreeItem>, Disposable {
  private disposed = false;
  private refreshing = true;
  private pipelines: Pipeline[] = [];
  private _onDidChangeTreeData: EventEmitter<
    Pipeline | undefined
  > = new EventEmitter<Pipeline | undefined>();
  readonly onDidChangeTreeData: Event<Pipeline | undefined> = this
    ._onDidChangeTreeData.event;

  constructor(
    public client: CircleCI,
    public config: Config,
    public gitMonitor: GitMonitor
  ) {}

  dispose(): void {
    this.disposed = true;
  }

  reloadPipeline(pipeline: Pipeline): void {
    this._onDidChangeTreeData.fire(pipeline);
  }

  refresh(): void {
    this.refreshing = true;
    this._onDidChangeTreeData.fire(undefined);
  }

  private getBranchSets(): ActivatableGitSet[] {
    return [
      ...new Set([
        this.gitMonitor.branch,
        ...(this.config.get('customBranches') as string[]),
      ]),
    ].map((branch) => ({
      branch,
      user: this.gitMonitor.user,
      repo: this.gitMonitor.repo,
      current: branch === this.gitMonitor.branch,
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

import {
  window,
  workspace,
  ExtensionContext,
  TreeDataProvider,
  TreeItem,
  Disposable,
  ProviderResult,
  EventEmitter,
  Event,
} from 'vscode';
import CircleCiApi from 'circleci';
import Pipeline from './pipeline';
import { getRepoName, getBranchName, getUserName } from '../lib/git';
import { openInBrowser } from '../lib/utils';

export default class CircleCI
  implements TreeDataProvider<TreeItem>, Disposable {
  private _client?: typeof CircleCiApi;
  private _onDidChangeTreeData: EventEmitter<
    Pipeline | undefined
  > = new EventEmitter<Pipeline | undefined>();
  readonly onDidChangeTreeData: Event<Pipeline | undefined> = this
    ._onDidChangeTreeData.event;
  config?: {
    apiToken: string;
    customBranches: string[];
    pipelineRefreshInterval: number;
    buildCount: number;
    buildRefreshInterval: number;
  };
  private _currentBranch = getBranchName();
  private _branchObserver?: NodeJS.Timer;
  private _disposed = false;
  private _hardRefresh = true;
  private _pipelineSets: GitData[];
  private _pipelineInstances: Pipeline[] = [];
  private _baseGitData?: {
    username: string;
    repo: string;
  };

  constructor(private readonly context: ExtensionContext) {
    this.getConfigs();
    this.getBaseGitData();
    this._pipelineSets = this.getPipelines();

    // TODO: replace this with a better way to observe for Git branch change
    this._branchObserver = setInterval(this.observeBranch.bind(this), 1000);

    workspace.onDidChangeConfiguration(() => {
      this.getConfigs();
      this.hardRefresh();
    });
  }

  // Client

  get client(): typeof CircleCiApi {
    if (this._client) {
      return this._client;
    }

    if (!this.config!.apiToken) {
      return window.showErrorMessage(
        'A CircleCI API token (`circleci.apiToken`) must be set.'
      );
    }

    return new CircleCiApi({
      auth: this.config!.apiToken,
    });
  }

  // Setup

  private getConfigs() {
    const {
      apiToken,
      customBranches,
      pipelineRefreshInterval,
      buildCount,
      buildRefreshInterval,
    } = workspace.getConfiguration('circleci');

    this.config = {
      apiToken,
      customBranches,
      pipelineRefreshInterval,
      buildCount,
      buildRefreshInterval,
    };
  }

  private getBaseGitData() {
    try {
      this._baseGitData = {
        username: getUserName(),
        repo: getRepoName(),
      };
    } catch (error) {
      window.showErrorMessage(
        'There was an issue retrieving your Git information.'
      );
    }
  }

  private getPipelines(): GitData[] {
    try {
      const { username, repo } = this._baseGitData!;

      return [
        ...new Set([this._currentBranch, ...this.config!.customBranches]),
      ].map((branch) => ({
        repo,
        username,
        branch,
        current: branch === this._currentBranch,
      }));
    } catch (error) {
      console.error(error.stack);
      return [];
    }
  }

  // Lifecycle

  private observeBranch() {
    if (this._disposed) {
      return clearInterval(this._branchObserver!);
    }

    try {
      const newBranch = getBranchName();

      if (this._currentBranch != newBranch) {
        this._currentBranch = newBranch;
        this.hardRefresh();
      }
    } catch (error) {
      // noop
    }
  }

  dispose() {
    this._disposed = true;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  openPage() {
    openInBrowser(
      `https://app.circleci.com/pipelines/github/${encodeURIComponent(
        this._baseGitData!.username
      )}/${encodeURIComponent(this._baseGitData!.repo)}`
    );
  }

  hardRefresh() {
    this._pipelineSets = this.getPipelines();
    this._hardRefresh = true;
    this._onDidChangeTreeData.fire();
  }

  removePipeline(branchName: string) {
    workspace.getConfiguration('circleci').update(
      'customBranches',
      this.config!.customBranches.filter((value) => value != branchName)
    );
  }

  // Data retrieval

  getTreeItem(element: Pipeline): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: Pipeline | undefined): ProviderResult<TreeItem[]> {
    if (!element) {
      if (this._hardRefresh && !this._disposed) {
        this._pipelineInstances = this._pipelineSets.map(
          (pipelineSet: GitData) => new Pipeline(pipelineSet, this)
        );

        this._hardRefresh = false;
        return this._pipelineInstances;
      } else {
        return this._pipelineInstances;
      }
    }

    return element.children;
  }
}

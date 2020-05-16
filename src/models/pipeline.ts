import { TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import CircleCI from './circleci';
import Build from './build';
import { getBranchName } from '../lib/git';
import { pluralize, getAsset, openInBrowser } from '../lib/utils';

export default class Pipeline extends TreeItem {
  readonly contextValue = 'circleciPipeline';
  private _initialized = false;
  private _refreshing = false;
  private _disposed = false;
  private _buildDatas: BuildData[] = [];
  private _buildInstances: Build[] = [];

  constructor(
    public readonly gitData: GitData,
    private readonly circleci: CircleCI
  ) {
    super(
      `${gitData.current ? '★ ' : ''}${gitData.repo}/${gitData.branch}`,
      TreeItemCollapsibleState.Expanded
    );

    if (!this._initialized) {
      this.refresh();
      this._initialized = true;
    }
  }

  // UI

  get description() {
    if (this._refreshing) {
      return 'Loading...';
    }

    if (!this._buildDatas.length) {
      return 'No builds';
    }

    return `Last ${this._buildDatas.length} ${pluralize(
      this._buildDatas.length,
      'build',
      'builds'
    )}`;
  }

  get tooltip() {
    return this.gitData.current
      ? `Current branch: ${this.gitData.repo}/${this.gitData.branch}`
      : `${this.gitData.repo}/${this.gitData.branch}`;
  }

  get iconPath() {
    console.log(getAsset('icon-pipeline-light.svg'));
    return {
      light: getAsset('icon-pipeline-light.svg'),
      dark: getAsset('icon-pipeline-dark.svg'),
    };
  }

  // Lifecycle

  refresh() {
    if (this._refreshing || this._disposed) {
      return;
    }

    this._refreshing = true;
    this._buildDatas = [];
    this._buildInstances = [];
    this.circleci.refresh();
    this.fetchBuilds();
  }

  dispose() {
    this._disposed = true;
  }

  openPage() {
    openInBrowser(
      `https://app.circleci.com/pipelines/github/${encodeURIComponent(
        this.gitData.username
      )}/${encodeURIComponent(this.gitData.repo)}?branch=${encodeURIComponent(
        this.gitData.branch
      )}`
    );
  }

  remove() {
    const branch = this.gitData.branch;

    if (branch === getBranchName()) {
      return window.showErrorMessage(
        `Sorry, you can't remove your current Git branch.`
      );
    }

    this.circleci.removePipeline(this.gitData.branch);
  }

  hasActiveBuilds() {
    return this._buildInstances.some((build) => build.active);
  }

  // Data retrieval

  async fetchBuilds(offset: number = 0) {
    console.log(
      `CircleCI API call: getBranchBuilds for branch ${this.gitData.branch}`
    );

    this._buildDatas = await this.circleci.client.getBranchBuilds({
      username: this.gitData.username,
      project: this.gitData.repo,
      branch: this.gitData.branch,
      limit: this.circleci.config!.buildCount,
      offset: offset,
    });

    this._refreshing = false;
    this.circleci.refresh();

    const refreshInterval: number = this.circleci.config!
      .pipelineRefreshInterval;
    if (!this.hasActiveBuilds() && refreshInterval > 0) {
      setTimeout(this.refresh.bind(this), refreshInterval * 1000);
    }
  }

  get children(): TreeItem[] {
    if (!this._buildInstances.length) {
      this._buildInstances = this._buildDatas.map(
        (build: BuildData) => new Build(build, this, this.circleci)
      );
    }

    return this._buildInstances;
  }
}

import { TreeItem, TreeItemCollapsibleState, window, env } from 'vscode';
import CircleCI from './circleci';
import { humanize, getAsset, msToTime, openInBrowser } from '../lib/utils';
import Pipeline from './pipeline';

const lifecycleMapping = {
  [BuildLifecycle.Finished]: 'dots',
  [BuildLifecycle.NotRun]: 'line',
  [BuildLifecycle.NotRunning]: 'line',
  [BuildLifecycle.Queued]: 'dots',
  [BuildLifecycle.Running]: 'dots-blue',
  [BuildLifecycle.Scheduled]: 'dots',
};

const statusMapping = {
  [BuildStatus.Success]: 'check',
  [BuildStatus.Failed]: 'exclaim',
  [BuildStatus.Timedout]: 'exclaim',
  [BuildStatus.InfrastructureFail]: 'exclaim',
  [BuildStatus.Canceled]: 'line',
  [BuildStatus.NoTests]: 'line',
};

function statusIcon(data: BuildData): string {
  if (data.lifecycle !== BuildLifecycle.Finished) {
    return lifecycleMapping[data.lifecycle];
  }

  return statusMapping[data.status];
};

function isActiveState(state: BuildLifecycle): boolean {
  return [
    BuildLifecycle.Running,
    BuildLifecycle.Queued,
    BuildLifecycle.Scheduled,
  ].includes(state);
}

export default class Build extends TreeItem {
  readonly contextValue = 'circleciBuild';
  private _initialized = false;
  private _refreshing = false;
  private _disposed = false;

  constructor(
    public data: BuildData,
    private readonly pipeline: Pipeline,
    private readonly circleci: CircleCI
  ) {
    super(
      `#${data.build_num} • ${data.build_parameters.CIRCLE_JOB}`,
      TreeItemCollapsibleState.Collapsed
    );

    if (!this._initialized) {
      this._initialized = true;

      if (isActiveState(this.data.lifecycle)) {
        this.refresh();
      }
    }
  }

  // UI

  get description() {
    if (this._refreshing) {
      return 'Loading...';
    }

    return humanize(this.data.status);
  }

  get tooltip() {
    return `Status: ${humanize(this.data.status)}`;
  }

  get iconPath() {
    return {
      light: getAsset(`icon-status-${statusIcon(this.data)}.svg`),
      dark: getAsset(`icon-status-${statusIcon(this.data)}.svg`),
    };
  }

  // Lifecycle

  refresh() {
    if (this._refreshing || this._disposed) {
      return;
    }

    this._refreshing = true;
    this.circleci.refresh();
    this.fetch();
  }

  dispose() {
    this._disposed = true;
  }

  openPage() {
    openInBrowser(this.data.build_url);
  }

  async retry() {
    console.log('Circle CI API call: retryBuild');

    const response = await this.circleci.client.retryBuild({
      username: this.pipeline.gitData.username,
      project: this.pipeline.gitData.repo,
      build_num: this.data.build_num,
    });

    // This does not restart the current build, but instead
    // retries it as a new build, so lets refresh the list
    this.pipeline.refresh();
  }

  async cancel() {
    console.log('Circle CI API call: cancelBuild');

    await this.circleci.client.cancelBuild({
      username: this.pipeline.gitData.username,
      project: this.pipeline.gitData.repo,
      build_num: this.data.build_num,
    });

    this.refresh();
  }

  copyBuildNumber() {
    env.clipboard.writeText(String(this.data.build_num));
    window.showInformationMessage('Build number copied to clipboard.');
  }

  // Data retrieval

  async fetch() {
    console.log('Circle CI API call: getBuild');

    this.data = await this.circleci.client.getBuild({
      username: this.pipeline.gitData.username,
      project: this.pipeline.gitData.repo,
      build_num: this.data.build_num,
    });

    this._refreshing = false;
    this.circleci.refresh();

    if (isActiveState(this.data.lifecycle)) {
      setTimeout(
        this.refresh.bind(this),
        this.circleci.config!.buildRefreshInterval * 1000
      );
    }
  }

  get children(): TreeItem[] {
    let children: TreeItem[] = [new BuildCommit(this.data)];

    if (this.data.workflows) {
      children.push(new BuildWorkflow(this.data));
    }

    children.push(new BuildTime(this.data));

    return children;
  }
}

export class BuildCommit extends TreeItem {
  readonly contextValue = 'circleciBuildCommit';

  constructor(readonly data: BuildData) {
    super(data.all_commit_details[0].subject, TreeItemCollapsibleState.None);
  }

  get tooltip() {
    return this.data.all_commit_details[0].commit;
  }

  iconPath = {
    light: getAsset('icon-commit-light.svg'),
    dark: getAsset('icon-commit-dark.svg'),
  };

  copyCommitHash() {
    env.clipboard.writeText(this.data.all_commit_details[0].commit);
    window.showInformationMessage('Commit hash copied to clipboard.');
  }
}

export class BuildWorkflow extends TreeItem {
  readonly contextValue = 'circleciBuildWorkflow';

  constructor(readonly data: BuildData) {
    super(data.workflows.workflow_name, TreeItemCollapsibleState.None);
  }

  iconPath = {
    light: getAsset('icon-workflow-light.svg'),
    dark: getAsset('icon-workflow-dark.svg'),
  };
}

export class BuildTime extends TreeItem {
  readonly contextValue = 'circleciBuildTime';

  constructor(readonly data: BuildData) {
    super(
      isActiveState(data.lifecycle)
        ? 'Still running...'
        : msToTime(data.build_time_millis),
      TreeItemCollapsibleState.None
    );
  }

  get description() {
    if (!isActiveState(this.data.lifecycle)) {
      return this.data.stop_time;
    }
  }

  iconPath = {
    light: getAsset('icon-time-light.svg'),
    dark: getAsset('icon-time-dark.svg'),
  };
}

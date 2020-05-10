import { TreeItem, TreeItemCollapsibleState, window, env, workspace, Uri } from 'vscode';
import CircleCI from './circleci';
import {
  humanize,
  getAsset,
  msToTime,
  openInBrowser,
  pluralize,
  downloadFile,
} from '../lib/utils';
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
}

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
  private _fetchingArtifacts = false;
  private _artifactSets: ArtifactData[] = [];

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

  async fetchArtifacts() {
    console.log('Circle CI API call: getBuildArtifacts');

    this._fetchingArtifacts = true;
    this.circleci.refresh();

    this._artifactSets = await this.circleci.client.getBuildArtifacts({
      username: this.pipeline.gitData.username,
      project: this.pipeline.gitData.repo,
      build_num: this.data.build_num,
    });

    this.circleci.refresh();
  }

  get children(): TreeItem[] {
    let children: TreeItem[] = [];

    const commitDetailGroups = this.data.all_commit_details;
    if (commitDetailGroups.length > 0) {
      if (commitDetailGroups.length > 1) {
        children.push(new BuildCommitGroup(commitDetailGroups));
      } else {
        children.push(new BuildCommit(commitDetailGroups[0]));
      }
    }

    if (this.data.workflows) {
      children.push(new BuildWorkflow(this.data));
    }

    children.push(new BuildTime(this.data));

    if (this.data.has_artifacts) {
      children.push(
        new BuildArtifacts(
          this.fetchArtifacts.bind(this),
          this._fetchingArtifacts,
          this._artifactSets
        )
      );
    }

    return children;
  }
}

export class BuildCommitGroup extends TreeItem {
  readonly contextValue = 'circleciBuildCommitGroup';

  constructor(readonly allCommitDetails: CommitDetails[]) {
    super(
      `${allCommitDetails.length} ${pluralize(
        allCommitDetails.length,
        'commit',
        'commits'
      )}`,
      TreeItemCollapsibleState.Collapsed
    );
  }

  iconPath = {
    light: getAsset('icon-commit-light.svg'),
    dark: getAsset('icon-commit-dark.svg'),
  };

  get children(): TreeItem[] {
    return this.allCommitDetails.map(
      (commitDetails) => new BuildCommit(commitDetails)
    );
  }
}

export class BuildCommit extends TreeItem {
  readonly contextValue = 'circleciBuildCommit';

  constructor(readonly commitDetails: CommitDetails) {
    super(commitDetails.subject, TreeItemCollapsibleState.None);
  }

  get tooltip() {
    return this.commitDetails.commit;
  }

  iconPath = {
    light: getAsset('icon-commit-light.svg'),
    dark: getAsset('icon-commit-dark.svg'),
  };

  copyCommitHash() {
    env.clipboard.writeText(this.commitDetails.commit);
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

  get description() {
    return this.data.workflows.workflow_id;
  }

  copyWorkflowId() {
    env.clipboard.writeText(this.data.workflows.workflow_id);
    window.showInformationMessage('Workflow ID copied to clipboard.');
  }
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

  get tooltip() {
    if (!isActiveState(this.data.lifecycle)) {
      return this.data.stop_time;
    } else {
      return 'Still runnning...';
    }
  }

  iconPath = {
    light: getAsset('icon-time-light.svg'),
    dark: getAsset('icon-time-dark.svg'),
  };
}

export class BuildArtifacts extends TreeItem {
  readonly contextValue = 'circleciBuildfetchArtifacts';

  constructor(
    readonly buildFetchArtifacts: Function,
    readonly loading: boolean,
    readonly artifactSets: ArtifactData[]
  ) {
    super(
      artifactSets.length
        ? `${artifactSets.length} ${pluralize(
            artifactSets.length,
            'artifact',
            'artifacts'
          )}`
        : loading
        ? 'Fetching artifacts...'
        : 'Look up artifacts',
      artifactSets.length
        ? TreeItemCollapsibleState.Expanded
        : TreeItemCollapsibleState.None
    );

    if (loading || !artifactSets?.length) {
      this.command = {
        command: 'circleci.buildFetchArtifacts',
        title: 'Fetch artifacts',
        arguments: [this],
      };
    }
  }

  iconPath = {
    light: getAsset('icon-box-light.svg'),
    dark: getAsset('icon-box-dark.svg'),
  };

  fetchArtifacts() {
    this.buildFetchArtifacts();
  }

  get children(): TreeItem[] {
    return this.artifactSets.map(
      (artifactSet) => new BuildArtifact(artifactSet)
    );
  }
}

export class BuildArtifact extends TreeItem {
  readonly contextValue = 'circleciBuildfetchArtifact';
  private _downloadedData?: string;

  constructor(readonly artifactSet: ArtifactData) {
    super(artifactSet.pretty_path, TreeItemCollapsibleState.None);

    this.command = {
      command: 'circleci.downloadArtifact',
      title: 'Download artifact',
      arguments: [this],
    };
  }

  async downloadArtifact() {
    if (!this._downloadedData) {
      try {
        this._downloadedData = await downloadFile(this.artifactSet.url);
      } catch (error) {
        window.showErrorMessage(
          `Could not download artifact: ${this.artifactSet.url}`
        );
      }
    }

    let output = `Artifact: ${this.artifactSet.pretty_path}\r\r`;
    output += this._downloadedData;

    const uri = Uri.parse(`circleci:${encodeURIComponent(output)}`);
    const doc = await workspace.openTextDocument(uri);
    await window.showTextDocument(doc, { preview: false });
  }
}

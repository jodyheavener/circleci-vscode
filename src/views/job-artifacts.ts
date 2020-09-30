import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { getAsset, localize, pluralize } from '../lib/utils';
import Job from './job';
import JobArtifact from './job-artifact';

export default class JobArtifacts extends TreeItem {
  readonly contextValue = 'circleciJobArtifacts';
  private fetching = false;
  private fetched = false;
  private artifacts: JobArtifact[] = [];

  constructor(readonly job: Job, readonly tree: CircleCITree) {
    super(
      localize('circleci.lookUpArtifacts', 'Look up Artifacts →'),
      TreeItemCollapsibleState.None
    );

    this.iconPath = getAsset(this.tree.context, 'box');

    this.command = {
      command: 'circleci.fetchJobArtifacts',
      title: localize('circleci.fetchArtifacts', 'Fetch Artifacts'),
      arguments: [this],
    };
  }

  async fetchArtifacts(): Promise<void> {
    if (this.fetching || this.fetched) {
      return;
    }

    this.fetching = true;
    const { items: artifacts } = await this.tree.client.listJobArtifacts(
      this.job.job.job_number!
    );

    this.label = artifacts.length
      ? `${pluralize(
          artifacts.length,
          localize('circleci.artifactSingular', 'Artifact'),
          localize('circleci.artifactPlural', 'Artifacts')
        )}`
      : localize('circleci.noArtifacts', 'No Artifacts');

    this.collapsibleState = artifacts.length
      ? TreeItemCollapsibleState.Expanded
      : TreeItemCollapsibleState.None;

    this.artifacts = artifacts.map(
      (artifact) => new JobArtifact(artifact, this.job, this.tree)
    );

    this.fetching = false;
    this.fetched = true;
    this.command = undefined;
    this.job.workflow.pipeline.refresh();
  }

  get children(): TreeItem[] {
    return this.artifacts;
  }
}

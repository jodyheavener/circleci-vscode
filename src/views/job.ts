import { Job as JobData } from 'circle-client';
import { env, TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { getAsset, openInBrowser, statusDescriptions } from '../lib/utils';
import Workflow from './workflow';
import JobDuration from './job-duration';
import JobArtifacts from './job-artifacts';
// import JobTests from './job-tests';

const statusIcons: {
  [status: string]: string;
} = {
  success: 'status-check',
  running: 'status-dots-blue',
  not_run: 'status-line',
  failed: 'status-exclaim',
  error: 'status-exclaim',
  failing: 'status-exclaim',
  on_hold: 'status-dots-grey',
  canceled: 'status-line',
  unauthorized: 'status-line',
};

export default class Job extends TreeItem {
  readonly contextValue = 'circleciJob';
  private reloading = false;
  private rows: TreeItem[] = [];

  constructor(
    readonly job: JobData,
    readonly workflow: Workflow,
    readonly tree: CircleCITree
  ) {
    super(job.name, TreeItemCollapsibleState.Collapsed);

    this.description = this.statusDescription(this.job.status);
    this.tooltip = job.name;
    this.iconPath = getAsset(
      this.tree.context,
      this.statusIcon(this.job.status)
    );

    // TODO: Add "click to load details" option
    this.loadDetails();
  }

  private statusDescription(status?: string): string {
    return statusDescriptions[status || 'Loading...'];
  }

  private statusIcon(status?: string): string {
    return statusIcons[status || 'not_run'];
  }

  private loadDetails(): void {
    // TODO: What should happen if job_number isn't present?
    if (!this.job.job_number) {
      return;
    }

    this.tree.client
      .getJob(this.job.job_number)
      .then(async (details) => {
        this.rows = [];

        this.description = this.statusDescription(details.status);
        this.iconPath = getAsset(
          this.tree.context,
          this.statusIcon(details.status)
        );

        if (details.duration) {
          this.rows.push(new JobDuration(details.duration, this.tree));
        }

        this.rows.push(new JobArtifacts(this, this.tree));
        // this.jobRows.push(new JobTests(this, this.tree));

        this.reloading = false;
        this.workflow.pipeline.refresh();
      })
      .catch((error) => {
        window.showErrorMessage(`Couldn't load details for Job ${this.job.id}`);
        console.error(error);
      });
  }

  reload(): void {
    if (this.reloading) {
      return;
    }

    this.reloading = true;
    this.loadDetails();
  }

  openPage(): void {
    openInBrowser(
      `https://app.circleci.com/pipelines/${this.tree.config.get(
        'VCSProvider'
      )}/${encodeURIComponent(
        this.workflow.pipeline.gitSet.user
      )}/${encodeURIComponent(this.workflow.pipeline.gitSet.repo)}/${
        this.workflow.workflow.pipeline_number
      }/workflows/${this.workflow.workflow.id}/jobs/${this.job.job_number}`
    );
  }

  copyId(): void {
    env.clipboard.writeText(this.job.id);
    window.showInformationMessage('Job ID copied to clipboard.');
  }

  copyNumber(): void {
    env.clipboard.writeText(String(this.job.job_number));
    window.showInformationMessage('Job number copied to clipboard.');
  }

  cancel(): void {
    this.tree.client.cancelJob(this.job.job_number!);
    window.showInformationMessage('Job canceled.');
    // TODO: is 1 second appropriate?
    setTimeout(this.reload.bind(this), 1000);
  }

  get children(): TreeItem[] {
    return this.rows;
  }
}

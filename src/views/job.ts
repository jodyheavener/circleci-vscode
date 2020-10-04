import { env, TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import { Job as JobData } from 'circle-client';
import constants from '../lib/constants';
import {
  getAsset,
  interpolate,
  openInBrowser,
  statusDescriptions,
  l
} from '../lib/utils';
import circleClient from '../lib/circle-client';
import Workflow from './workflow';
import JobDuration from './job-duration';
import JobArtifacts from './job-artifacts';
import JobTests from './job-tests';

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
  private reloading = false;
  private rows: TreeItem[] = [];

  constructor(readonly job: JobData, readonly workflow: Workflow) {
    super(job.name, TreeItemCollapsibleState.Collapsed);

    this.description = this.statusDescription(this.job.status);
    this.tooltip = job.name;
    this.iconPath = getAsset(this.statusIcon(this.job.status));

    this.loadDetails();
    this.setContextValue();
  }

  private statusDescription(status?: string): string {
    return statusDescriptions[status || l('loadingLabel', 'Loading...')];
  }

  private statusIcon(status?: string): string {
    return statusIcons[status || 'not_run'];
  }

  private loadDetails(): void {
    circleClient().then((client) => {
      client
        .getJob(this.job.job_number!)
        .then(async (details) => {
          this.rows = [];

          this.description = this.statusDescription(details.status);
          this.iconPath = getAsset(this.statusIcon(details.status));

          if (details.duration) {
            this.rows.push(new JobDuration(details.duration));
          }

          this.rows.push(new JobArtifacts(this));
          this.rows.push(new JobTests(this));
          this.setContextValue();

          this.reloading = false;
          this.workflow.pipeline.refresh();
        })
        .catch((error) => {
          window.showErrorMessage(
            l(
              'loadJobDetailsFail',
              `Couldn't load details for Job {0}`,
              this.job.id
            )
          );
          console.error(error);
        });
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
      interpolate(constants.JOB_URL, {
        vcs: this.workflow.pipeline.gitSet.vcs,
        user: this.workflow.pipeline.gitSet.user,
        repo: this.workflow.pipeline.gitSet.repo,
        pipeline_number: this.workflow.workflow.pipeline_number,
        workflow_id: this.workflow.workflow.id,
        job_number: this.job.job_number!,
      })
    );
  }

  copyId(): void {
    env.clipboard.writeText(this.job.id);
    window.showInformationMessage(
      l('jobIdCopied', 'Job ID copied to clipboard.')
    );
  }

  copyNumber(): void {
    env.clipboard.writeText(String(this.job.job_number));
    window.showInformationMessage(
      l('jobNumberCopied', 'Job number copied to clipboard.')
    );
  }

  async cancel(): Promise<void> {
    (await circleClient()).cancelJob(this.job.job_number!);
    window.showInformationMessage(l('jobCanceled', 'Job canceled.'));
    setTimeout(this.reload.bind(this), 1000);
  }

  get children(): TreeItem[] {
    return this.rows;
  }

  private setContextValue(): void {
    let value = constants.JOB_CONTEXT_BASE;

    if (this.job.status === 'running') {
      value += ':running';
    }

    this.contextValue = value;
  }
}

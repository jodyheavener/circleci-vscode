import { Job as JobData } from 'circle-client';
import {
  Disposable,
  env,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from 'vscode';
import circleClient from '../lib/circle-client';
import constants from '../lib/constants';
import {
  getAsset,
  interpolate,
  l,
  openInBrowser,
  statusDescriptions,
} from '../lib/utils';
import JobArtifacts from './job-artifacts';
import JobDuration from './job-duration';
import JobTests from './job-tests';
import Workflow from './workflow';

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
  hold: 'status-pause',
  unknown: 'status-unknown',
};

export default class Job extends TreeItem implements Disposable {
  private reloading = false;
  private disposed = false;
  private rows: TreeItem[] = [];

  constructor(readonly job: JobData, readonly workflow: Workflow) {
    super(job.name, TreeItemCollapsibleState.None);

    this.description = this.statusDescription(this.job.status);
    this.tooltip = job.name;
    this.iconPath = getAsset(this.statusIcon(this.job.status));

    this.loadDetails();
    this.setContextValue();
  }

  private statusDescription(status?: string): string {
    if (this.job.type === 'build') {
      return statusDescriptions[status || 'loading'];
    } else if (this.job.type === 'approval') {
      return statusDescriptions['on_hold'];
    } else {
      return statusDescriptions['loading'];
    }
  }

  private statusIcon(status?: string): string {
    if (this.job.type === 'build') {
      return statusIcons[status || 'unknown'];
    } else if (this.job.type === 'approval') {
      return statusIcons['hold'];
    } else {
      return statusIcons['unknown'];
    }
  }

  private loadDetails(): void {
    if (this.job.type !== 'build') {
      return;
    }

    circleClient().then((client) => {
      client
        .getJob(this.job.job_number!)
        .then(async (details) => {
          this.rows = [];

          this.description = this.statusDescription(details.status);
          this.iconPath = getAsset(this.statusIcon(details.status));

          if (details.duration) {
            try {
              this.rows.push(new JobDuration(details.duration));
            } catch (error) {
              console.error('Error loading JobDuration row', error);
            }
          }

          try {
            this.rows.push(new JobArtifacts(this));
          } catch (error) {
            console.error('Error loading JobArtifacts row', error);
          }

          try {
            this.rows.push(new JobTests(this));
          } catch (error) {
            console.error('Error loading JobTests row', error);
          }

          this.setContextValue();

          this.reloading = false;
          this.workflow.pipeline.refresh();
          this.collapsibleState = TreeItemCollapsibleState.Collapsed;
        })
        .catch((error) => {
          // window.showErrorMessage(
          //   l(
          //     'loadJobDetailsFail',
          //     `Couldn't load details for Job {0}`,
          //     this.job.id
          //   )
          // );
          console.error(error);
        });
    });
  }

  disposeRows(): void {
    this.rows.forEach((row) => {
      if ('dispose' in row) {
        // @ts-expect-error TODO
        row.dispose();
      }
    });
  }

  reload(): void {
    if (this.reloading) {
      return;
    }

    this.reloading = true;
    this.disposeRows();
    this.loadDetails();
  }

  dispose(): void {
    this.disposeRows();
    this.disposed = true;
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

  async approve(): Promise<void> {
    if (this.job.approval_request_id) {
      return void window.showErrorMessage(
        l(
          'noApprovalRequest',
          "Couldn't find Approval Request ID for Job {0}",
          this.job.id
        )
      );
    }

    (await circleClient()).approveWorkflowJob(
      this.workflow.workflow.id,
      this.job.approval_request_id!
    );
    window.showInformationMessage(l('jobCanceled', 'Job approved.'));
    setTimeout(this.reload.bind(this), 1000);
  }

  get children(): TreeItem[] {
    return this.rows;
  }

  private setContextValue(): void {
    let value = constants.JOB_CONTEXT_BASE;

    if (this.job.type === 'build') {
      value += ':build';
    }

    if (this.job.type === 'approval') {
      value += ':approval';
    }

    if (this.job.status === 'running') {
      value += ':running';
    }

    this.contextValue = value;
  }
}

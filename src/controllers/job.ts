import { Job as JobData } from 'circle-client';
import { env, TreeItem } from 'vscode';
import { client } from '../lib/circleci';
import { ActivityStatusMap, URLS } from '../lib/constants';
import { events } from '../lib/events';
import { ActivatableGitData, Events } from '../lib/types';
import { interpolate, openInBrowser } from '../lib/utils';
import { Artifacts } from '../tree-items/artifacts';
import { Job } from '../tree-items/job';
import { Tests } from '../tree-items/tests';
import { Timer } from '../tree-items/timer';
import { WorkflowController } from './workflow';

export class JobController {
  view: Job;

  constructor(
    private gitSet: ActivatableGitData,
    private workflow: WorkflowController,
    public data: JobData
  ) {
    this.view = new Job(
      this,
      data.name,
      ActivityStatusMap[data.status],
      data.type
    );

    this.fetch();
  }

  async fetch(): Promise<void> {
    this.view.setLoading(true);
    events.fire(Events.ReloadTree, this.view);

    const job = await client.getJob(this.data.job_number);
    let views: TreeItem[] = [];

    if (job.duration && job.duration > 0) {
      views.push(new Timer(job.duration));
    }

    views = views.concat(new Artifacts(), new Tests());
    this.view.children = views;
    this.view.setLoading(false);

    events.fire(Events.ReloadTree, this.view);
  }

  openPage(): void {
    const { vcs, user, repo } = this.gitSet;
    openInBrowser(
      interpolate(URLS.JOB_URL, {
        vcs,
        user,
        repo,
        pipeline_number: this.workflow.data.pipeline_number,
        workflow_id: this.workflow.data.id,
        job_number: this.data.job_number,
      })
    );
  }

  copyId(): void {
    env.clipboard.writeText(this.data.id);
  }

  copyNumber(): void {
    env.clipboard.writeText(String(this.data.job_number));
  }

  async cancel(): Promise<void> {
    await client.cancelJob(this.data.job_number);
    setTimeout(this.fetch.bind(this), 1000);
  }

  async approve(): Promise<void> {
    client.approveWorkflowJob(
      this.workflow.data.id,
      this.data.approval_request_id
    );
    setTimeout(this.fetch.bind(this), 1000);
  }
}

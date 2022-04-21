import { Job as JobData } from 'circle-client';
import { env, TreeItem } from 'vscode';
import { client } from '../lib/circleci';
import { ActivityStatusMap, URLS } from '../lib/constants';
import { events } from '../lib/events';
import { gitService } from '../lib/git-service';
import { Events } from '../lib/types';
import { interpolate, openInBrowser } from '../lib/utils';
import { Job } from '../tree-items/job';
import { Timer } from '../tree-items/timer';
import { ArtifactsController } from './artifacts';
import { TestsController } from './tests';
import { WorkflowController } from './workflow';

export class JobController {
  view: Job;
  tests: TestsController;
  artifacts: ArtifactsController;

  constructor(private workflow: WorkflowController, public data: JobData) {
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

    this.tests = new TestsController(
      this.data.job_number,
      this.data.name,
      this.workflow.data.pipeline_number,
      this.workflow.data.id
    );
    this.artifacts = new ArtifactsController(this.data.job_number);

    views = views.concat(this.artifacts.view, this.tests.view);
    this.view.children = views;
    this.view.setLoading(false);

    events.fire(Events.ReloadTree, this.view);
  }

  openPage(): void {
    const { vcs, user, repo } = gitService.data;
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
    env.clipboard.writeText(this.data.job_number.toString());
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

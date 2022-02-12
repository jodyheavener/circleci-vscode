import { Workflow as WorkflowData } from 'circle-client';
import { client } from '../lib/circleci';
import { URLS } from '../lib/constants';
import { events } from '../lib/events';
import { ActivatableGitData, Events } from '../lib/types';
import { interpolate, openInBrowser } from '../lib/utils';
import { Workflow } from '../tree-items/workflow';
import { JobController } from './job';

export class WorkflowController {
  view: Workflow;
  jobs: JobController[];

  constructor(private gitSet: ActivatableGitData, private data: WorkflowData) {
    this.view = new Workflow(this, data.name);

    this.fetch();
  }

  async fetch(): Promise<void> {
    this.view.setLoading(true);
    events.fire(Events.ReloadTree, this.view);

    const { items } = await client.listWorkflowJobs(this.data.id);

    this.jobs = items.map(
      (job) => new JobController(this.gitSet, this.data, job)
    );

    this.view.children = this.jobs.map((job) => job.view);
    this.view.setLoading(false);

    events.fire(Events.ReloadTree, this.view);
  }

  openPage(): void {
    const { vcs, user, repo } = this.gitSet;
    openInBrowser(
      interpolate(URLS.WORKFLOW_URL, {
        vcs,
        user,
        repo,
        pipeline_number: this.data.pipeline_number,
        workflow_id: this.data.id,
      })
    );
  }
}

import { Workflow as WorkflowData } from 'circle-client';
import { env } from 'vscode';
import { client } from '../lib/circleci';
import { configuration } from '../lib/config';
import { ActivityStatusMap, COMMANDS, URLS } from '../lib/constants';
import { events } from '../lib/events';
import { gitService } from '../lib/git-service';
import { ConfigKey, Events } from '../lib/types';
import { interpolate, openInBrowser } from '../lib/utils';
import { Workflow } from '../tree-items/workflow';
import { JobController } from './job';
import { PipelineController } from './pipeline';

export class WorkflowController {
  view: Workflow;
  jobs: JobController[];

  constructor(private pipeline: PipelineController, public data: WorkflowData) {
    this.view = new Workflow(this, data.name, ActivityStatusMap[data.status]);

    if (configuration.get(ConfigKey.JobsAutoLoad)) {
      this.fetch();
    } else {
      this.view.setDescription('Load jobs →');
      this.view.setCommand(COMMANDS.REFETCH, 'Load jobs');
    }
  }

  async fetch(): Promise<void> {
    this.view.setLoading(true);
    events.fire(Events.ReloadTree, this.view);

    const jobs = (await client.listWorkflowJobs(this.data.id)).items;

    this.jobs = jobs.map((job) => new JobController(this, job));

    this.view.children = this.jobs.map((job) => job.view);
    this.view.setCommand();
    this.view.setDescription(ActivityStatusMap[this.data.status]);
    this.view.setLoading(false);
    this.view.setCommand();

    events.fire(Events.ReloadTree, this.view);
  }

  openPage(): void {
    const { vcs, user, repo } = gitService.data;
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

  copyId(): void {
    env.clipboard.writeText(this.data.id);
  }

  async cancel(): Promise<void> {
    await client.cancelWorkflow(this.data.id);
    setTimeout(this.fetch.bind(this), 1000);
  }

  async retryJobs(fromFailed = false): Promise<void> {
    await client.rerunWorkflow(this.data.id, { fromFailed });
    // Retry adds *new* jobs, so reload the whole pipeline
    setTimeout(() => {
      this.pipeline.fetch();
    }, 1000);
  }
}

import { Workflow as WorkflowData, WorkflowStatus } from 'circle-client';
import { env } from 'vscode';
import { client } from '../lib/circleci';
import { configuration } from '../lib/config';
import { ActivityStatusMap, COMMANDS, URLS } from '../lib/constants';
import { events } from '../lib/events';
import { ActivatableGitData, ConfigKey, Events } from '../lib/types';
import { interpolate, openInBrowser } from '../lib/utils';
import { Workflow } from '../tree-items/workflow';
import { JobController } from './job';
import { PipelineController } from './pipeline';

export class WorkflowController {
  view: Workflow;
  jobs: JobController[];
  refetchInterval: NodeJS.Timer;
  refetchWorkflowData = false;
  initialLoad: boolean;

  constructor(
    private gitSet: ActivatableGitData,
    private pipeline: PipelineController,
    public data: WorkflowData
  ) {
    this.view = new Workflow(this, data.name, ActivityStatusMap[data.status]);

    if (configuration.get(ConfigKey.AutoLoadWorkflowJobs)) {
      this.fetch();
    } else {
      this.refetchWorkflowData = true;
      this.view.setDescription('Click to load Jobs');
      this.view.setCommand(COMMANDS.REFETCH, 'Load Jobs');
    }

    events.on(Events.ConfigChange, this.autoRefetch.bind(this));
  }

  private autoRefetch(): void {
    clearInterval(this.refetchInterval);
    const interval = configuration.get<number>(
      ConfigKey.WorkflowReloadInterval
    );
    if (
      interval === 0 ||
      !this.initialLoad ||
      this.data.status !== WorkflowStatus.Running
    ) {
      return;
    }
    this.refetchInterval = setInterval(this.fetch.bind(this), interval * 1000);
  }

  async fetch(): Promise<void> {
    this.view.setLoading(true);
    events.fire(Events.ReloadTree, this.view);

    if (this.refetchWorkflowData) {
      this.data = await client.getWorkflow(this.data.id);
      this.view.setStatus(ActivityStatusMap[this.data.status]);
    }

    const { items } = await client.listWorkflowJobs(this.data.id);
    this.jobs = items.map((job) => new JobController(this.gitSet, this, job));
    this.view.children = this.jobs.map((job) => job.view);
    this.view.setCommand();
    this.view.setLoading(false);
    this.initialLoad = true;
    this.refetchWorkflowData = true;

    events.fire(Events.ReloadTree, this.view);

    this.autoRefetch();
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

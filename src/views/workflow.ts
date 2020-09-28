import { Workflow as WorkflowData } from 'circle-client';
import { env, TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { getAsset, openInBrowser, pluralize } from '../lib/utils';
import Pipeline from './Pipeline';
import Job from './job';

export default class Workflow extends TreeItem {
  readonly contextValue = 'circleci-workflow';
  private reloading = false;
  private jobs: Job[] = [];

  constructor(
    readonly workflow: WorkflowData,
    readonly pipeline: Pipeline,
    readonly tree: CircleCITree
  ) {
    super(workflow.name, TreeItemCollapsibleState.Expanded);

    this.description = 'Loading...';
    this.tooltip = workflow.name;
    this.iconPath = {
      light: getAsset(this.tree.context, 'icon-workflow-light.svg'),
      dark: getAsset(this.tree.context, 'icon-workflow-dark.svg'),
    };

    // TODO: Add option to enable auto-load jobs
    this.loadJobs();
  }

  private loadJobs(): void {
    this.tree.client
      .listWorkflowJobs(this.workflow.id)
      .then(async ({ items: jobs }) => {
        const noJobs = 'No jobs';
        const jobsLabel = pluralize(jobs.length, 'job', 'jobs');
        this.description = jobs.length ? jobsLabel : noJobs;
        this.tooltip = `${jobs.length ? jobsLabel : noJobs} for ${
          this.workflow.name
        }`;

        this.jobs = jobs.map((job) => new Job(job, this, this.tree));
        this.reloading = false;
        this.pipeline.refresh();
      })
      .catch((error) => {
        window.showErrorMessage(
          `Couldn't load jobs for workflow ${this.workflow.name}`
        );
        console.error(error);
      });
  }

  reload(): void {
    if (this.reloading) {
      return;
    }

    this.reloading = true;
    this.loadJobs();
  }

  openPage(): void {
    openInBrowser(
      `https://app.circleci.com/pipelines/github/${encodeURIComponent(
        this.pipeline.gitSet.user
      )}/${encodeURIComponent(this.pipeline.gitSet.repo)}/${
        this.workflow.pipeline_number
      }/workflows/${this.workflow.id}`
    );
  }

  copyId(): void {
    env.clipboard.writeText(this.workflow.id);
    window.showInformationMessage('Workflow ID copied to clipboard.');
  }

  cancel(): void {
    this.tree.client.cancelWorkflow(this.workflow.id);
    window.showInformationMessage('Workflow canceled.');
    // TODO: is 1 second appropriate?
    setTimeout(this.reload.bind(this), 1000);
  }

  retryJobs(fromFailed = false): void {
    this.tree.client.rerunWorkflow(this.workflow.id, { fromFailed });
    window.showInformationMessage(
      `Retrying ${fromFailed ? ' failed' : ''}workflow jobs.`
    );
    // Retry adds *new* jobs, so reload the whole pipeline
    // TODO: is 1 second appropriate?
    setTimeout(this.pipeline.reload.bind(this), 1000);
  }

  get children(): TreeItem[] {
    return this.jobs;
  }
}

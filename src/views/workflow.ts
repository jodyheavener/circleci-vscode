import { Workflow as WorkflowData } from 'circle-client';
import { env, TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import {
  getAsset,
  openInBrowser,
  pluralize,
  statusDescriptions,
} from '../lib/utils';
import Pipeline from './Pipeline';
import Empty from './empty';
import Job from './job';
import LoadItems from './load-items';

export default class Workflow extends TreeItem {
  readonly contextValue = 'circleciWorkflow';
  private reloading = false;
  private rows: TreeItem[] = [];

  constructor(
    readonly workflow: WorkflowData,
    readonly pipeline: Pipeline,
    readonly tree: CircleCITree
  ) {
    super(workflow.name, TreeItemCollapsibleState.Expanded);

    this.tooltip = workflow.name;
    this.iconPath = getAsset(this.tree.context, 'workflow');

    if (this.tree.config.get('autoLoadWorkflowJobs')) {
      this.description = 'Loading...';
      this.loadJobs();
    } else {
      this.rows = [new LoadItems('Jobs', this.loadJobs.bind(this))];
    }
  }

  private loadJobs(): void {
    this.tree.client
      .listWorkflowJobs(this.workflow.id)
      .then(async ({ items: jobs }) => {
        const noJobs = 'No Jobs';
        const jobsLabel = pluralize(jobs.length, 'Job', 'Jobs');
        this.description = `${jobs.length ? jobsLabel : noJobs} - ${
          statusDescriptions[this.workflow.status || 'Unknown']
        }`;
        this.tooltip = `${jobs.length ? jobsLabel : noJobs} for ${
          this.workflow.name
        }`;

        this.rows = jobs.length
          ? jobs.map((job) => new Job(job, this, this.tree))
          : [new Empty('jobs', this.tree)];
        this.reloading = false;
        this.pipeline.refresh();
      })
      .catch((error) => {
        window.showErrorMessage(
          `Couldn't load Jobs for Workflow ${this.workflow.name}`
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
      `https://app.circleci.com/pipelines/${this.tree.config.get(
        'VCSProvider'
      )}/${encodeURIComponent(this.pipeline.gitSet.user)}/${encodeURIComponent(
        this.pipeline.gitSet.repo
      )}/${this.workflow.pipeline_number}/workflows/${this.workflow.id}`
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
      `Retrying ${fromFailed ? ' failed' : ''}Workflow Jobs.`
    );
    // Retry adds *new* jobs, so reload the whole pipeline
    // TODO: is 1 second appropriate?
    setTimeout(this.pipeline.reload.bind(this), 1000);
  }

  get children(): TreeItem[] {
    return this.rows;
  }
}

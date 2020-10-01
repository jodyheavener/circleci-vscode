import { Workflow as WorkflowData, Job as JobData } from 'circle-client';
import { env, TreeItemCollapsibleState, window } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { getAsset, l, openInBrowser } from '../lib/utils';
import ResourcesItem from './resources-item';
import Pipeline from './pipeline';
import Job from './job';
import config from '../lib/config';
import circleClient from '../lib/circle-client';

export default class Workflow extends ResourcesItem {
  readonly contextValue = 'circleciWorkflow';

  constructor(
    readonly workflow: WorkflowData,
    readonly pipeline: Pipeline,
    readonly tree: CircleCITree
  ) {
    super(
      workflow.name,
      TreeItemCollapsibleState.Expanded,
      l('jobPlural', 'Jobs'),
      config().get('autoLoadWorkflowJobs') as boolean,
      tree
    );

    this.tooltip = workflow.name;
    this.iconPath = getAsset('workflow');
    this.setup(pipeline.refresh.bind(pipeline));
  }

  updateResources(): void {
    this.loadResources<JobData>(async () => {
      return (await circleClient()).listWorkflowJobs(this.workflow.id, {
        pageToken: this.pageToken!,
      });
    }).then((newJobs) => {
      this.mainRows.push(
        ...newJobs.map((job) => new Job(job, this, this.tree))
      );
      this.didUpdate();
    });
  }

  openPage(): void {
    openInBrowser(
      `https://app.circleci.com/pipelines/${config().get(
        'VCSProvider'
      )}/${encodeURIComponent(this.pipeline.gitSet.user)}/${encodeURIComponent(
        this.pipeline.gitSet.repo
      )}/${this.workflow.pipeline_number}/workflows/${this.workflow.id}`
    );
  }

  copyId(): void {
    env.clipboard.writeText(this.workflow.id);
    window.showInformationMessage(
      l('workflowIdCopied', 'Workflow ID copied to clipboard.')
    );
  }

  async cancel(): Promise<void> {
    (await circleClient()).cancelWorkflow(this.workflow.id);
    window.showInformationMessage(l('workflowCanceled', 'Workflow canceled.'));
    // TODO: is 1 second appropriate?
    setTimeout(this.reload.bind(this), 1000);
  }

  async retryJobs(fromFailed = false): Promise<void> {
    (await circleClient()).rerunWorkflow(this.workflow.id, { fromFailed });
    window.showInformationMessage(
      fromFailed
        ? l('retryingJobs', 'Retrying Workflow Jobs')
        : l('retryingFailedJobs', 'Retrying failed Workflow Jobs')
    );
    // Retry adds *new* jobs, so reload the whole pipeline
    // TODO: is 1 second appropriate?
    setTimeout(this.pipeline.reload.bind(this), 1000);
  }
}

import { env, TreeItemCollapsibleState, window } from 'vscode';
import {
  Workflow as WorkflowData,
  Job as JobData,
  WorkflowStatus,
} from 'circle-client';
import {
  getAsset,
  interpolate,
  l,
  openInBrowser,
  statusDescriptions,
} from '../lib/utils';
import config from '../lib/config';
import circleClient from '../lib/circle-client';
import constants from '../lib/constants';
import { ConfigKey } from '../lib/types';
import ResourcesItem from './resources-item';
import Pipeline from './pipeline';
import Job from './job';

export default class Workflow extends ResourcesItem {
  constructor(public workflow: WorkflowData, readonly pipeline: Pipeline) {
    super(
      workflow.name,
      TreeItemCollapsibleState.Expanded,
      l('jobPlural', 'Jobs'),
      config().get(ConfigKey.AutoLoadWorkflowJobs) as boolean
    );

    this.tooltip = workflow.name;
    this.iconPath = getAsset('workflow');
    this.setup();
    this.setContextValue();
  }

  updateResources(): void {
    this.loadResources<JobData>(async () => {
      return (await circleClient()).listWorkflowJobs(this.workflow.id, {
        pageToken: this.pageToken!,
      });
    }).then(async (newJobs) => {
      this.workflow = await (await circleClient()).getWorkflow(
        this.workflow.id
      );
      this.mainRows.push(...newJobs.map((job) => new Job(job, this)));
      this.description =
        statusDescriptions[
          this.workflow.status || l('unknownLabel', 'Unknown')
        ];
      this.setContextValue();
      this.didUpdate();
    });
  }

  refresh(): void {
    this.pipeline.refresh();
  }

  get reloadRate(): number {
    return config().get(ConfigKey.WorkflowReloadInterval) as number;
  }

  get shouldReload(): boolean {
    return this.workflow.status === WorkflowStatus.Running;
  }

  openPage(): void {
    openInBrowser(
      interpolate(constants.WORKFLOW_URL, {
        vcs: this.pipeline.gitSet.vcs,
        user: this.pipeline.gitSet.user,
        repo: this.pipeline.gitSet.repo,
        pipeline_number: this.workflow.pipeline_number,
        workflow_id: this.workflow.id,
      })
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
    setTimeout(this.pipeline.reload.bind(this), 1000);
  }

  private setContextValue(): void {
    let value = constants.WORKFLOW_CONTEXT_BASE;

    if (this.workflow.status === WorkflowStatus.Running) {
      value += ':running';
    }

    if (this.workflow.status === WorkflowStatus.Failing) {
      value += ':failing';
    }

    if (this.workflow.status === WorkflowStatus.Failed) {
      value += ':failed';
    }

    this.contextValue = value;
  }
}

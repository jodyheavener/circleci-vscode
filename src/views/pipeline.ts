import { TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { ActivatableGitSet } from '../lib/types';
import { getAsset, openInBrowser, pluralize } from '../lib/utils';
import Workflow from './workflow';

export default class Pipeline extends TreeItem {
  readonly contextValue = 'circleci-pipeline';
  private reloading = false;
  private workflows: Workflow[] = [];

  constructor(readonly gitSet: ActivatableGitSet, readonly tree: CircleCITree) {
    super(
      `${gitSet.current ? '★ ' : ''}${gitSet.branch}`,
      TreeItemCollapsibleState.Expanded
    );

    this.description = 'Loading...';
    this.tooltip = `${this.gitSet.repo}/${this.gitSet.branch}`;
    this.iconPath = {
      light: getAsset(this.tree.context, 'icon-pipeline-light.svg'),
      dark: getAsset(this.tree.context, 'icon-pipeline-dark.svg'),
    };

    // TODO: Add option to enable auto-load workflows
    this.loadWorkflows();
  }

  private loadWorkflows(): void {
    this.tree.client
      .listProjectPipelines({ branch: this.gitSet.branch })
      .then(async ({ items: pipelines }) => {
        const workflows = (
          await Promise.all(
            pipelines.map(async (pipeline) => {
              const result = await this.tree.client.listPipelineWorkflows(
                pipeline.id
              );
              return result.items;
            })
          )
        ).flat();

        const noWorkflows = 'No workflows';
        const workflowLabel = pluralize(
          workflows.length,
          'workflow',
          'workflows'
        );
        this.description = workflows.length ? workflowLabel : noWorkflows;
        this.tooltip = `${workflows.length ? workflowLabel : noWorkflows} for ${
          this.gitSet.repo
        }/${this.gitSet.branch}`;

        this.workflows = workflows.map(
          (workflow) => new Workflow(workflow, this, this.tree)
        );
        this.reloading = false;
        this.tree.reloadPipeline(this);
      })
      .catch((error) => {
        window.showErrorMessage(
          `Couldn't load workflows for pipeline ${this.gitSet.repo}/${this.gitSet.branch}`
        );
        console.error(error);
      });
  }

  refresh(): void {
    this.tree.reloadPipeline(this);
  }

  reload(): void {
    if (this.reloading) {
      return;
    }

    this.reloading = true;
    this.loadWorkflows();
  }

  openPage(): void {
    openInBrowser(
      `https://app.circleci.com/pipelines/github/${encodeURIComponent(
        this.gitSet.user
      )}/${encodeURIComponent(this.gitSet.repo)}?branch=${encodeURIComponent(
        this.gitSet.branch
      )}`
    );
  }

  get children(): TreeItem[] {
    return this.workflows;
  }
}

import { TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { ActivatableGitSet } from '../lib/types';
import { getAsset, localize, openInBrowser, pluralize } from '../lib/utils';
import Empty from './empty';
import LoadItems from './load-items';
import Workflow from './workflow';

export default class Pipeline extends TreeItem {
  readonly contextValue = 'circleciPipeline';
  private reloading = false;
  private rows: TreeItem[] = [];

  constructor(readonly gitSet: ActivatableGitSet, readonly tree: CircleCITree) {
    super(
      `${
        gitSet.current
          ? localize('circleci.currentBranchLabel', 'Current: ')
          : ''
      }${gitSet.branch}`,
      TreeItemCollapsibleState.Expanded
    );

    this.tooltip = `${this.gitSet.repo}/${this.gitSet.branch}`;
    this.iconPath = getAsset(this.tree.context, 'pipeline');

    if (this.tree.config.get('autoLoadWorkflows')) {
      this.description = localize('circleci.loadingLabel', 'Loading...');
      this.loadWorkflows();
    } else {
      this.rows = [
        new LoadItems(
          localize('circleci.workflowSingular', 'Workflow'),
          this.loadWorkflows.bind(this)
        ),
      ];
    }
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

        const noWorkflows = localize('circleci.noWorkflows', 'No Workflows');
        const workflowLabel = pluralize(
          workflows.length,
          localize('circleci.workflowSingular', 'Workflow'),
          localize('circleci.workflowPlural', 'Workflows')
        );
        this.description = workflows.length ? workflowLabel : noWorkflows;
        this.tooltip = `${workflows.length ? workflowLabel : noWorkflows} for ${
          this.gitSet.repo
        }/${this.gitSet.branch}`;

        this.rows = workflows.length
          ? workflows.map((workflow) => new Workflow(workflow, this, this.tree))
          : [
              new Empty(
                localize('circleci.workflowPlural', 'Workflows'),
                this.tree
              ),
            ];
        this.reloading = false;
        this.tree.reloadPipeline(this);
      })
      .catch((error) => {
        window.showErrorMessage(
          localize(
            'circleci.loadWorkflowFail',
            `Couldn't load Workflows for Pipeline {0}`,
            `${this.gitSet.repo}/${this.gitSet.branch}`
          )
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
      `https://app.circleci.com/pipelines/${this.tree.config.get(
        'VCSProvider'
      )}/${encodeURIComponent(this.gitSet.user)}/${encodeURIComponent(
        this.gitSet.repo
      )}?branch=${encodeURIComponent(this.gitSet.branch)}`
    );
  }

  get children(): TreeItem[] {
    return this.rows;
  }
}

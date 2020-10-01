import { TreeItemCollapsibleState } from 'vscode';
import { Workflow as WorkflowData } from 'circle-client';
import CircleCITree from '../lib/circleci-tree';
import { ActivatableGitSet } from '../lib/types';
import { getAsset, localize, openInBrowser } from '../lib/utils';
import ResourcesItem from './resources-item';
import Workflow from './workflow';

export default class Pipeline extends ResourcesItem {
  readonly contextValue = 'circleciPipeline';

  constructor(readonly gitSet: ActivatableGitSet, readonly tree: CircleCITree) {
    super(
      `${gitSet.current ? '★ ' : ''}${gitSet.branch}`,
      TreeItemCollapsibleState.Expanded,
      localize('circleci.workflowPlural', 'Workflows'),
      tree.config.get('autoLoadWorkflows') as boolean,
      tree
    );

    this.tooltip = `${this.gitSet.repo}/${this.gitSet.branch}`;
    this.iconPath = getAsset(this.tree.context, 'pipeline');
    this.setup(tree.reloadPipeline.bind(tree, this));
  }

  updateResources(): void {
    this.loadResources<WorkflowData>(async () => {
      const { items: pipelines } = await this.tree.client.listProjectPipelines({
        branch: this.gitSet.branch,
      });
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
      // This is a hack because we're double mapping pipelines against
      // workflows and can't produce a next_page_token for both. This
      // means right now there's no "load more" option unfortunately.
      return {
        items: workflows,
        next_page_token: null,
      };
    }).then((newWorkflows) => {
      this.mainRows.push(
        ...newWorkflows.map(
          (workflow) => new Workflow(workflow, this, this.tree)
        )
      );
      this.didUpdate();
    });
  }

  refresh(): void {
    this.tree.reloadPipeline(this);
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
}

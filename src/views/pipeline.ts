import { TreeItemCollapsibleState } from 'vscode';
import { Workflow as WorkflowData } from 'circle-client';
import CircleCITree from '../lib/circleci-tree';
import { ActivatableGitSet } from '../lib/types';
import { getAsset, l, openInBrowser } from '../lib/utils';
import ResourcesItem from './resources-item';
import Workflow from './workflow';
import config from '../lib/config';
import circleClient from '../lib/circle-client';

export default class Pipeline extends ResourcesItem {
  readonly contextValue = 'circleciPipeline';

  constructor(readonly gitSet: ActivatableGitSet, readonly tree: CircleCITree) {
    super(
      `${gitSet.current ? '★ ' : ''}${gitSet.branch}`,
      TreeItemCollapsibleState.Expanded,
      l('workflowPlural', 'Workflows'),
      config().get('autoLoadWorkflows') as boolean
    );

    this.tooltip = `${this.gitSet.repo}/${this.gitSet.branch}`;
    this.iconPath = getAsset('pipeline');
    this.setup();
  }

  updateResources(): void {
    this.loadResources<WorkflowData>(async () => {
      const { items: pipelines } = await (
        await circleClient()
      ).listProjectPipelines({
        branch: this.gitSet.branch,
      });

      const workflows = (
        await Promise.all(
          pipelines.map(async (pipeline) => {
            const result = await (await circleClient()).listPipelineWorkflows(
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
        ...newWorkflows.map((workflow) => new Workflow(workflow, this))
      );
      this.didUpdate();
    });
  }

  get reloadRate(): number {
    return config().get('pipelineReloadInterval') as number;
  }

  get shouldReload(): boolean {
    return true;
  }

  refresh(): void {
    this.tree.refreshPipeline(this);
  }

  openPage(): void {
    openInBrowser(
      `https://app.circleci.com/pipelines/${config().get(
        'VCSProvider'
      )}/${encodeURIComponent(this.gitSet.user)}/${encodeURIComponent(
        this.gitSet.repo
      )}?branch=${encodeURIComponent(this.gitSet.branch)}`
    );
  }
}

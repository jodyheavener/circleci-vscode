import {
  Pipeline as PipelineData,
  Workflow as WorkflowData,
} from 'circle-client';
import { TreeItemCollapsibleState, window } from 'vscode';
import circleClient from '../lib/circle-client';
import config from '../lib/config';
import constants from '../lib/constants';
import PipelinesTree from '../lib/pipelines-tree';
import { ActivatableGitSet, ConfigKey } from '../lib/types';
import {
  getAsset,
  interpolate,
  l,
  openInBrowser,
  pluralize,
} from '../lib/utils';
import ResourcesItem from './resources-item';
import Workflow from './workflow';

export default class Pipeline extends ResourcesItem {
  readonly contextValue = constants.PIPELINE_CONTEXT_BASE;

  constructor(
    readonly gitSet: ActivatableGitSet,
    readonly tree: PipelinesTree
  ) {
    super(
      `${gitSet.current ? '★ ' : ''}${gitSet.branch}`,
      TreeItemCollapsibleState.Expanded,
      l('workflowPlural', 'Workflows'),
      config().get(ConfigKey.AutoLoadWorkflows) as boolean
    );

    this.tooltip = `${this.gitSet.repo}/${this.gitSet.branch}`;
    this.iconPath = getAsset('pipeline');
    this.setup();
  }

  updateResources(): void {
    this.loadResources<WorkflowData>(async () => {
      const pipelines: PipelineData[] = [];
      try {
        const { items } = await (
          await circleClient()
        ).listProjectPipelines({
          branch: this.gitSet.branch,
        });

        pipelines.push(...items);
      } catch (error) {
        console.log(error);
        window.showErrorMessage(
          l(
            'pipelineLoadError',
            'There was a problem loading Pipelines for {0}. Is your API token correct?',
            this.gitSet.branch
          )
        );
      }

      const workflows = (
        await Promise.all(
          pipelines.map(async (pipeline) => {
            const result = await (
              await circleClient()
            ).listPipelineWorkflows(pipeline.id);
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
      this.description = pluralize(
        this.mainRows.length,
        l('workflowSingular', 'Workflow'),
        l('workflowPlural', 'Workflows')
      );
      this.didUpdate();
    });
  }

  get reloadRate(): number {
    return config().get(ConfigKey.PipelineReloadInterval) as number;
  }

  get shouldReload(): boolean {
    return true;
  }

  refresh(): void {
    this.tree.refreshPipeline(this);
  }

  openPage(): void {
    openInBrowser(
      interpolate(constants.PIPELINE_URL, {
        vcs: this.gitSet.vcs,
        user: this.gitSet.user,
        repo: this.gitSet.repo,
        branch: this.gitSet.branch,
      })
    );
  }
}

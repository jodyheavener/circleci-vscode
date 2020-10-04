import { TreeItemCollapsibleState } from 'vscode';
import { Workflow as WorkflowData } from 'circle-client';
import constants from '../lib/constants';
import PipelinesTree from '../lib/pipelines-tree';
import { ActivatableGitSet, ConfigKey } from '../lib/types';
import {
  getAsset,
  interpolate,
  openInBrowser,
  pluralize,
} from '../lib/utils';
import { l } from '../lib/localize';
import config from '../lib/config';
import circleClient from '../lib/circle-client';
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

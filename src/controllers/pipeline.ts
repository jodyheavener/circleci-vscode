import { Pipeline as PipelineData } from 'circle-client';
import { client } from '../lib/circleci';
import { URLS } from '../lib/constants';
import { events } from '../lib/events';
import { ActivatableGitData, Events } from '../lib/types';
import { interpolate, openInBrowser } from '../lib/utils';
import { Pipeline } from '../tree-items/pipeline';
import { WorkflowController } from './workflow';

export class PipelineController {
  view: Pipeline;
  workflows: WorkflowController[];

  constructor(private gitSet: ActivatableGitData) {
    this.view = new Pipeline(
      this,
      gitSet.branch,
      `${gitSet.repo}/${gitSet.branch}`
    );

    if (gitSet.active) {
      this.view.setActive(true);
    }

    this.fetch();
  }

  async fetch(): Promise<void> {
    this.view.setLoading(true);
    events.fire(Events.ReloadTree, this.view);

    const pipelines: PipelineData[] = [];
    try {
      const { items } = await client.listProjectPipelines({
        branch: this.gitSet.branch,
      });

      pipelines.push(...items);
    } catch (error) {
      console.log(error);
      throw new Error(
        `There was a problem loading Pipelines for ${this.gitSet.branch}.`
      );
    }

    const workflows = (
      await Promise.all(
        pipelines.map(
          async (pipeline) =>
            (
              await client.listPipelineWorkflows(pipeline.id)
            ).items
        )
      )
    ).flat();

    this.workflows = workflows.map(
      (workflow) => new WorkflowController(this.gitSet, workflow)
    );

    this.view.children = this.workflows.map((workflow) => workflow.view);
    this.view.updateWorkflowCount();
    this.view.setLoading(false);

    events.fire(Events.ReloadTree, this.view);
  }

  openPage(): void {
    const { vcs, user, repo, branch } = this.gitSet;
    openInBrowser(
      interpolate(URLS.PIPELINE_URL, {
        vcs,
        user,
        repo,
        branch,
      })
    );
  }
}
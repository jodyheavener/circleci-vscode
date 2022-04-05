import { client } from '../lib/circleci';
import { URLS } from '../lib/constants';
import { events } from '../lib/events';
import { gitService } from '../lib/git-service';
import { Events, GitBranch } from '../lib/types';
import { interpolate, openInBrowser } from '../lib/utils';
import { Branch } from '../tree-items/branch';
import { PipelineController } from './pipeline';

export class BranchController {
  view: Branch;
  pipelines: PipelineController[];

  constructor(private branch: GitBranch) {
    this.view = new Branch(
      this,
      branch.name,
      `${gitService.data.repo}/${branch.name}`
    );

    if (branch.active) {
      this.view.setActive(true);
    }

    this.fetch();
  }

  async fetch(): Promise<void> {
    this.view.setLoading(true);
    events.fire(Events.ReloadTree, this.view);

    const pipelines = (
      await client.listProjectPipelines({
        branch: this.branch.name,
      })
    ).items;

    this.pipelines = pipelines.map(
      (pipeline) => new PipelineController(pipeline)
    );

    this.view.children = this.pipelines.map((pipeline) => pipeline.view);
    this.view.setCommand();
    this.view.setLoading(false);

    events.fire(Events.ReloadTree, this.view);
  }

  openPage(): void {
    const { vcs, user, repo } = gitService.data;
    openInBrowser(
      interpolate(URLS.BRANCH_URL, {
        vcs,
        user,
        repo,
        branch: this.branch.name,
      })
    );
  }
}

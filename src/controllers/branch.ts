import { URLS } from '../lib/constants';
import { ActivatableGitData } from '../lib/types';
import { interpolate, openInBrowser } from '../lib/utils';
import { Branch } from '../tree-items/branch';
import { PipelineController } from './pipeline';

export class BranchController {
  view: Branch;
  pipelines: PipelineController[];

  constructor(private gitSet: ActivatableGitData) {
    this.view = new Branch(
      this,
      gitSet.branch,
      `${gitSet.repo}/${gitSet.branch}`
    );
  }

  openPage(): void {
    const { vcs, user, repo, branch } = this.gitSet;
    openInBrowser(
      interpolate(URLS.BRANCH_URL, {
        vcs,
        user,
        repo,
        branch,
      })
    );
  }
}

import { Job as JobData, Workflow } from 'circle-client';
import { URLS } from '../lib/constants';
import { ActivatableGitData } from '../lib/types';
import { interpolate, openInBrowser } from '../lib/utils';
import { Job } from '../tree-items/job';

export class JobController {
  view: Job;

  constructor(
    private gitSet: ActivatableGitData,
    private workflow: Workflow,
    private data: JobData
  ) {
    this.view = new Job(this, data.name);
  }

  async fetch(): Promise<void> {
    console.log('fetching job');
  }

  openPage(): void {
    const { vcs, user, repo } = this.gitSet;
    openInBrowser(
      interpolate(URLS.JOB_URL, {
        vcs,
        user,
        repo,
        pipeline_number: this.workflow.pipeline_number,
        workflow_id: this.workflow.id,
        job_number: this.data.job_number,
      })
    );
  }
}

import { TreeItemCollapsibleState } from 'vscode';
import { JobArtifact as JobArtifactData } from 'circle-client';
import constants from '../lib/constants';
import circleClient from '../lib/circle-client';
import { getAsset, l } from '../lib/utils';
import Job from './job';
import JobArtifact from './job-artifact';
import ResourcesItem from './resources-item';

export default class JobArtifacts extends ResourcesItem {
  readonly contextValue = constants.JOB_ARTIFACTS_CONTEXT_BASE;

  constructor(readonly job: Job) {
    super(
      l('lookUpArtifacts', 'Look up Artifacts →'),
      TreeItemCollapsibleState.None,
      l('artifactPlural', 'Artifacts'),
      false
    );

    this.command = {
      command: constants.FETCH_JOB_ARTIFACTS_COMMAND,
      title: l('fetchArtifacts', 'Fetch Artifacts'),
      arguments: [this],
    };

    this.iconPath = getAsset('box');
    this.setup();
  }

  updateResources(): void {
    this.command = undefined;
    this.collapsibleState = TreeItemCollapsibleState.Expanded;
    this.job.workflow.pipeline.refresh();

    this.loadResources<JobArtifactData>(async () => {
      return (await circleClient()).listJobArtifacts(this.job.job.job_number!, {
        pageToken: this.pageToken!,
      });
    }).then((newArtifacts) => {
      this.mainRows.push(
        ...newArtifacts.map((artifact) => new JobArtifact(artifact, this.job))
      );
      this.label = l('viewArtifacts', 'View Artifacts');
      this.didUpdate();
    });
  }

  refresh(): void {
    this.job.workflow.pipeline.refresh();
  }
}

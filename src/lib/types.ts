export enum ConfigKey {
  APIToken = 'apiToken',
  GitRemote = 'project.gitRemote',
  UseGitBranches = 'project.useGitBranches',
  BranchesToWatch = 'project.branchesToWatch',
  PipelinesReloadInterval = 'pipelines.reloadInterval',
  WorkflowsAutoLoad = 'workflows.autoLoad',
  WorkflowsReloadInterval = 'workflows.reloadInterval',
  JobsAutoLoad = 'jobs.autoLoad',
}

export type ConfigItems = {
  [ConfigKey.APIToken]: string;
  [ConfigKey.GitRemote]: string;
  [ConfigKey.UseGitBranches]: boolean;
  [ConfigKey.BranchesToWatch]: string[];
  [ConfigKey.PipelinesReloadInterval]: number;
  [ConfigKey.WorkflowsAutoLoad]: boolean;
  [ConfigKey.WorkflowsReloadInterval]: number;
  [ConfigKey.JobsAutoLoad]: boolean;
};

export enum ActivityStatus {
  Success = 'Success',
  Running = 'Running',
  NotRun = 'Not Run',
  Failed = 'Failed',
  Error = 'Error',
  Failing = 'Failing',
  OnHold = 'On Hold',
  Canceled = 'Canceled',
  Unauthorized = 'Unauthorized',
  Queued = 'Queued',
}

export enum Events {
  ConfigChange,
  ClientUpdate,
  GitDataUpdate,
  ReloadTree,
}

export enum VcsProvider {
  GitHub = 'github',
  BitBucket = 'bitbucket',
}

export type ProjectData = {
  vcs: VcsProvider;
  user: string;
  repo: string;
};

export type GitData = ProjectData & {
  branch: string;
};

export type ActivatableGitData = GitData & {
  active: boolean;
};

export enum ConfigKey {
  APIToken = 'apiToken',
  VcsProvider = 'VcsProvider',
  WatchedBranches = 'watchedBranches',
  AutoLoadWorkflows = 'autoLoadWorkflows',
  AutoLoadWorkflowJobs = 'autoLoadWorkflowJobs',
  PipelineReloadInterval = 'pipelineReloadInterval',
  WorkflowReloadInterval = 'workflowReloadInterval',
}

export type ConfigItems = {
  [ConfigKey.APIToken]: string;
  [ConfigKey.WatchedBranches]: string[];
  [ConfigKey.AutoLoadWorkflows]: boolean;
  [ConfigKey.AutoLoadWorkflowJobs]: boolean;
  [ConfigKey.PipelineReloadInterval]: number;
  [ConfigKey.WorkflowReloadInterval]: number;
  [ConfigKey.VcsProvider]: 'github' | 'bitbucket';
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

export type GitData = {
  vcs: 'github' | 'bitbucket';
  user: string;
  repo: string;
  branch: string;
};

export type ActivatableGitData = GitData & {
  active: boolean;
};

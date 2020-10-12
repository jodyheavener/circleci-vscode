export enum ConfigKey {
  APIToken = 'apiToken',
  VcsProvider = 'VcsProvider',
  CustomBranches = 'customBranches',
  AutoLoadWorkflows = 'autoLoadWorkflows',
  AutoLoadWorkflowJobs = 'autoLoadWorkflowJobs',
  PipelineReloadInterval = 'pipelineReloadInterval',
  WorkflowReloadInterval = 'workflowReloadInterval',
}

export type ConfigItems = {
  [ConfigKey.APIToken]: string;
  [ConfigKey.CustomBranches]: string[];
  [ConfigKey.AutoLoadWorkflows]: boolean;
  [ConfigKey.AutoLoadWorkflowJobs]: boolean;
  [ConfigKey.PipelineReloadInterval]: number;
  [ConfigKey.WorkflowReloadInterval]: number;
  [ConfigKey.VcsProvider]: 'github' | 'bitbucket';
};

export type GitSet = {
  vcs: 'github' | 'bitbucket';
  user: string;
  repo: string;
  branch: string;
};

export type ActivatableGitSet = GitSet & {
  current: boolean;
};

export type Asset = {
  light: string;
  dark: string;
};

export type PostMessagePayload = { event: string; data?: any };

export type JobTestDetails = {
  jobName: string;
  jobNumber: number;
  pipelineNumber: number;
  workflowId: string;
  vcs: string;
  user: string;
  repo: string;
};

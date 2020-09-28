export type ConfigItems = {
  apiToken: string;
  customBranches: string[];
};

export type GitSet = {
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

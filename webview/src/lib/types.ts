export type JobData = {
  ready: boolean;
  name: string;
  vcs: "github" | "bitbucket";
  user: string;
  repo: string;
  pipeline_number: number;
  workflow_id: string;
  job_number: number;
  tests: TestDetails[];
};

export type TestDetails = {
  classname: string;
  file: string | null;
  message: string | null;
  name: string;
  result: "success" | "failure";
  run_time: number;
  source: string;
};

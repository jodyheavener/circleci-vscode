declare module 'circleci';

declare const enum BuildLifecycle {
  Finished = 'finished',
  Queued = 'queued',
  Scheduled = 'scheduled',
  NotRun = 'not_run',
  NotRunning = 'no_running',
  Running = 'running',
}

declare const enum BuildStatus {
  Canceled = 'canceled',
  InfrastructureFail = 'infrastructure_fail',
  Timedout = 'timedout',
  Failed = 'failed',
  NoTests  = 'no_tests',
  Success = 'success',
}

interface BuildData {
  build_parameters: {
    CIRCLE_JOB: string;
  };
  lifecycle: BuildLifecycle;
  status: BuildStatus;
  build_url: string;
  build_time_millis: number;
  stop_time: string;
  build_num: number;
  all_commit_details: {
    commit: string;
    subject: string;
  }[]
  workflows: {
    job_name: string;
    workflow_name: string;
  }
}

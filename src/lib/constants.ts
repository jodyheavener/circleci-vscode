import { ActivityStatus } from './types';

export const EXTENSION_ID = 'circleci-vscode';

export const PIPELINES_TREE_ID = 'circleciPipelinesTree';

export const COMMANDS = {
  OPEN_JOB_ARTIFACT: 'circleci.openJobArtifact',
  FETCH_JOB_ARTIFACTS: 'circleci.fetchJobArtifacts',
  REFETCH: 'circleci.refetch',
  OPEN_PAGE: 'circleci.openPage',
  CANCEL_WORKFLOW: 'circleci.cancelWorkflow',
  RETRY_ALL_WORKFLOWS: 'circleci.retryWorkflowAll',
  RETRY_FAILED_WORKFLOWS: 'circleci.retryWorkflowFailed',
  COPY_WORKFLOW_ID: 'circleci.copyWorkflowId',
  CANCEL_JOB: 'circleci.cancelJob',
  APPROVE_JOB: 'circleci.approveJob',
  COPY_JOB_ID: 'circleci.copyJobId',
  COPY_JOB_NUMBER: 'circleci.copyJobNumber',
  LOAD_JOB_TESTS: 'circleci.loadJobTests',
  OPEN_JOB_TESTS: 'circleci.openJobTests',
};

export const CONTEXTS = {
  BRANCH_BASE: 'circleciBranch',
  PIPELINE_BASE: 'circleciPipeline',
  WORKFLOW_BASE: 'circleciWorkflow',
  JOB_BASE: 'circleciJob',
  TIMER_BASE: 'circleciTimer',
  ARTIFACTS_BASE: 'circleciArtifacts',
  ARTIFACT_BASE: 'circleciArtifact',
  TESTS_BASE: 'circleciTests',
};

export const URLS = {
  PROJECT_URL: 'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}',
  BRANCH_URL:
    'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}?branch={branch}',
  PIPELINE_URL:
    'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}/{pipeline_number}',
  WORKFLOW_URL:
    'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}/{pipeline_number}/workflows/{workflow_id}',
  JOB_URL:
    'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}/{pipeline_number}/workflows/{workflow_id}/jobs/{job_number}',
};

export const ActivityStatusMap = {
  success: ActivityStatus.Success,
  running: ActivityStatus.Running,
  not_run: ActivityStatus.NotRun,
  failed: ActivityStatus.Failed,
  error: ActivityStatus.Error,
  failing: ActivityStatus.Failing,
  on_hold: ActivityStatus.OnHold,
  canceled: ActivityStatus.Canceled,
  unauthorized: ActivityStatus.Unauthorized,
  queued: ActivityStatus.Queued,
};

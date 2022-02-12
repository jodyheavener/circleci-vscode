export const EXTENSION_ID = 'circleci-vscode';

export const PIPELINES_TREE_ID = 'circleciPipelinesTree';

export const COMMANDS = {
  OPEN_JOB_ARTIFACT: 'circleci.openJobArtifact',
  FETCH_JOB_ARTIFACTS: 'circleci.fetchJobArtifacts',
  LOAD_ITEMS: 'circleci.loadItems',
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
  PIPELINE_BASE: 'circleciPipeline',
  WORKFLOW_BASE: 'circleciWorkflow',
  JOB_BASE: 'circleciJob',
  TIMER_BASE: 'circleciTimer',
  ARTIFACTS_BASE: 'circleciArtifacts',
  ARTIFACT_BASE: 'circleciArtifact',
};

export const URLS = {
  PROJECT_URL: 'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}',
  PIPELINE_URL:
    'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}?branch={branch}',
  WORKFLOW_URL:
    'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}/{pipeline_number}/workflows/{workflow_id}',
  JOB_URL:
    'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}/{pipeline_number}/workflows/{workflow_id}/jobs/{job_number}',
};

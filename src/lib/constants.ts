export default {
  EXTENSION_ID: 'circleci-vscode',
  QUALIFIED_EXTENSION_ID: 'jodyh.circleci-vscode',
  EXTENSION_VERSION: 'circleciExtensionVersion',

  LOCALIZATION_PREFIX: 'circleciExtension',

  PROJECT_URL: 'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}',
  PIPELINE_URL:
    'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}?branch={branch}',
  WORKFLOW_URL:
    'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}/{pipeline_number}/workflows/{workflow_id}',
  JOB_URL:
    'https://app.circleci.com/pipelines/{vcs}/{user}/{repo}/{pipeline_number}/workflows/{workflow_id}/jobs/{job_number}',

  PIPELINES_TREE_VIEW_ID: 'circleciPipelinesTree',

  TEXT_ARTIFACT_PROVIDER_SCHEME: 'circleciTextArtifact',

  PIPELINE_CONTEXT_BASE: 'circleciPipeline',
  WORKFLOW_CONTEXT_BASE: 'circleciWorkflow',
  LOADER_CONTEXT_BASE: 'circleciLoader',
  JOB_CONTEXT_BASE: 'circleciJob',
  JOB_DURATION_CONTEXT_BASE: 'circleciDuration',
  JOB_ARTIFACTS_CONTEXT_BASE: 'circleciArtifacts',
  JOB_ARTIFACT_CONTEXT_BASE: 'circleciArtifact',
  EMPTY_CONTEXT_BASE: 'circleciEmpty',
  JOB_TESTS_CONTEXT_BASE: 'circleciTests',

  LOAD_ITEMS_COMMAND: 'circleci.loadItems',
  RELOAD_COMMAND: 'circleci.reload',
  OPEN_PAGE_COMMAND: 'circleci.openPage',
  CANCEL_WORKFLOW_COMMAND: 'circleci.cancelWorkflow',
  RETRY_ALL_WORKFLOWS_COMMAND: 'circleci.retryWorkflowAll',
  RETRY_FAILED_WORKFLOWS_COMMAND: 'circleci.retryWorkflowFailed',
  COPY_WORKFLOW_ID_COMMAND: 'circleci.copyWorkflowId',
  OPEN_JOB_ARTIFACT_COMMAND: 'circleci.openJobArtifact',
  FETCH_JOB_ARTIFACTS_COMMAND: 'circleci.fetchJobArtifacts',
  CANCEL_JOB_COMMAND: 'circleci.cancelJob',
  APPROVE_JOB_COMMAND: 'circleci.approveJob',
  COPY_JOB_ID_COMMAND: 'circleci.copyJobId',
  COPY_JOB_NUMBER_COMMAND: 'circleci.copyJobNumber',
  LOAD_JOB_TESTS_COMMAND: 'circleci.loadJobTests',
  OPEN_JOB_TESTS_COMMAND: 'circleci.openJobTests',

  JOB_TESTS_WEBVIEW_ID: 'circleci.jobTestsWebView',
  WELCOME_WEBVIEW_ID: 'circleci.welcomeWebView',
  UPGRADE_WEBVIEW_ID: 'circleci.upgradeWebView',

  JOB_DATA_WEBVIEW_EVENT: 'circleci.jobDataWebview',
  TEST_DATA_WEBVIEW_EVENT: 'circleci.testDataWebview',
  CHANGELOG_CONTENT_WEBVIEW_EVENT: 'circleci.changelogContentWebview',
  REQUEST_TESTS_WEBVIEW_EVENT: 'circleci.requestTestsWebview',
  REQUEST_JOB_WEBVIEW_EVENT: 'circleci.requestJobWebview',
  OPEN_FILE_WEBVIEW_EVENT: 'circleci.openFileWebview',
  WELCOME_SETUP_WEBVIEW_EVENT: 'circleci.welcomeSetupWebview',
  UPDATE_TOKEN_WEBVIEW_EVENT: 'circleci.updateTokenWebview',
};

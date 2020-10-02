export default {
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
  JOB_DURATION_CONTEXT_BASE: 'circleciJobDuration',
  JOB_ARTIFACTS_CONTEXT_BASE: 'circleciJobArtifacts',
  JOB_ARTIFACT_CONTEXT_BASE: 'circleciJobArtifact',
  EMPTY_CONTEXT_BASE: 'circleciEmpty',
};

import { commands } from 'vscode';
import Pipeline from '../views/Pipeline';
import Workflow from '../views/Workflow';
import Job from '../views/Job';
import JobArtifacts from '../views/job-artifacts';
import JobArtifact from '../views/job-artifact';
import Loader from '../views/loader';

const registerCommands = (): void => {
  commands.registerCommand(
    'circleci.reload',
    (item: Pipeline | Workflow | Job) => {
      item.reload();
    }
  );

  commands.registerCommand(
    'circleci.openPage',
    (item: Pipeline | Workflow | Job) => {
      item.openPage();
    }
  );

  commands.registerCommand('circleci.cancelWorkflow', (item: Workflow) => {
    item.cancel();
  });

  commands.registerCommand('circleci.retryWorkflowAll', (item: Workflow) => {
    item.retryJobs();
  });

  commands.registerCommand('circleci.retryWorkflowFailed', (item: Workflow) => {
    item.retryJobs(true);
  });

  commands.registerCommand('circleci.copyWorkflowId', (item: Workflow) => {
    item.copyId();
  });

  commands.registerCommand('circleci.cancelJob', (item: Workflow) => {
    item.cancel();
  });

  commands.registerCommand('circleci.copyJobId', (item: Job) => {
    item.copyId();
  });

  commands.registerCommand('circleci.copyJobNumber', (item: Job) => {
    item.copyNumber();
  });

  commands.registerCommand(
    'circleci.fetchJobArtifacts',
    (item: JobArtifacts) => {
      item.updateResources();
    }
  );

  commands.registerCommand('circleci.openJobArtifact', (item: JobArtifact) => {
    item.openJobArtifact();
  });

  commands.registerCommand('circleci.loadItems', (item: Loader) => {
    item.loadItems();
  });
};

export default registerCommands;

import { commands, Disposable } from 'vscode';
import Job from '../views/job';
import JobArtifact from '../views/job-artifact';
import JobArtifacts from '../views/job-artifacts';
import Loader from '../views/loader';
import Pipeline from '../views/pipeline';
import Workflow from '../views/workflow';
import constants from './constants';
import PipelinesTree from './pipelines-tree';

const registerCommands = (pipelineTree: PipelinesTree): Disposable[] => {
  return [
    commands.registerCommand(constants.LOAD_ITEMS_COMMAND, (item: Loader) => {
      item.loadItems();
    }),

    commands.registerCommand(
      constants.RELOAD_COMMAND,
      (item: Pipeline | Workflow | Job | undefined) => {
        if (!item) {
          pipelineTree.reload();
        } else {
          item.reload();
        }
      }
    ),

    commands.registerCommand(
      constants.OPEN_PAGE_COMMAND,
      (item: Pipeline | Workflow | Job | undefined) => {
        if (!item) {
          pipelineTree.openPage();
        } else {
          item.openPage();
        }
      }
    ),

    commands.registerCommand(
      constants.CANCEL_WORKFLOW_COMMAND,
      (item: Workflow) => {
        item.cancel();
      }
    ),

    commands.registerCommand(
      constants.RETRY_ALL_WORKFLOWS_COMMAND,
      (item: Workflow) => {
        item.retryJobs();
      }
    ),

    commands.registerCommand(
      constants.RETRY_FAILED_WORKFLOWS_COMMAND,
      (item: Workflow) => {
        item.retryJobs(true);
      }
    ),

    commands.registerCommand(
      constants.COPY_WORKFLOW_ID_COMMAND,
      (item: Workflow) => {
        item.copyId();
      }
    ),

    commands.registerCommand(constants.CANCEL_JOB_COMMAND, (item: Job) => {
      item.cancel();
    }),

    commands.registerCommand(constants.APPROVE_JOB_COMMAND, (item: Job) => {
      item.approve();
    }),

    commands.registerCommand(constants.COPY_JOB_ID_COMMAND, (item: Job) => {
      item.copyId();
    }),

    commands.registerCommand(constants.COPY_JOB_NUMBER_COMMAND, (item: Job) => {
      item.copyNumber();
    }),

    commands.registerCommand(
      constants.FETCH_JOB_ARTIFACTS_COMMAND,
      (item: JobArtifacts) => {
        item.updateResources();
      }
    ),

    commands.registerCommand(
      constants.OPEN_JOB_ARTIFACT_COMMAND,
      (item: JobArtifact) => {
        item.openJobArtifact();
      }
    ),
  ];
};

export default registerCommands;

import { commands, Disposable } from 'vscode';
import { Job } from '../tree-items/job';
import { Pipeline } from '../tree-items/pipeline';
import { Workflow } from '../tree-items/workflow';
import { COMMANDS } from './constants';
import PipelineTreeDataProvider from './pipeline-tree-data-provider';

const registerCommands = (
  pipelineTree: PipelineTreeDataProvider
): Disposable[] => {
  return [
    commands.registerCommand(
      COMMANDS.REFETCH,
      (item?: Pipeline | Workflow | Job) => {
        if (!item) {
          pipelineTree.fetch();
        } else {
          item.controller.fetch();
        }
      }
    ),

    commands.registerCommand(
      COMMANDS.OPEN_PAGE,
      (item?: Pipeline | Workflow | Job) => {
        if (!item) {
          pipelineTree.openPage();
        } else {
          item.controller.openPage();
        }
      }
    ),

    commands.registerCommand(COMMANDS.CANCEL_WORKFLOW, (item: Workflow) => {
      item.controller.cancel();
    }),

    commands.registerCommand(COMMANDS.RETRY_ALL_WORKFLOWS, (item: Workflow) => {
      item.controller.retryJobs();
    }),

    commands.registerCommand(
      COMMANDS.RETRY_FAILED_WORKFLOWS,
      (item: Workflow) => {
        item.controller.retryJobs(true);
      }
    ),

    commands.registerCommand(COMMANDS.COPY_WORKFLOW_ID, (item: Workflow) => {
      item.controller.copyId();
    }),

    commands.registerCommand(COMMANDS.CANCEL_JOB, (item: Job) => {
      item.controller.cancel();
    }),

    commands.registerCommand(COMMANDS.APPROVE_JOB, (item: Job) => {
      item.controller.approve();
    }),

    commands.registerCommand(COMMANDS.COPY_JOB_ID, (item: Job) => {
      item.controller.copyId();
    }),

    commands.registerCommand(COMMANDS.COPY_JOB_NUMBER, (item: Job) => {
      item.controller.copyNumber();
    }),

    // commands.registerCommand(constants.LOAD_ITEMS_COMMAND, (item: Loader) => {
    //   item.loadItems();
    // }),

    // commands.registerCommand(
    //   constants.FETCH_JOB_ARTIFACTS_COMMAND,
    //   (item: JobArtifacts) => {
    //     item.updateResources();
    //   }
    // ),

    // commands.registerCommand(
    //   constants.OPEN_JOB_ARTIFACT_COMMAND,
    //   (item: JobArtifact) => {
    //     item.openJobArtifact();
    //   }
    // ),
  ];
};

export default registerCommands;

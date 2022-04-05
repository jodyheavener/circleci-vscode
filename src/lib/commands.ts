import { commands, Disposable } from 'vscode';
import { Artifact } from '../tree-items/artifact';
import { Artifacts } from '../tree-items/artifacts';
import { Branch } from '../tree-items/branch';
import { Job } from '../tree-items/job';
import { Pipeline } from '../tree-items/pipeline';
import { Tests } from '../tree-items/tests';
import { Workflow } from '../tree-items/workflow';
import { COMMANDS } from './constants';
import ProjectTreeDataProvider from './project-tree-data-provider';

const registerCommands = (
  projectTree: ProjectTreeDataProvider
): Disposable[] => {
  return [
    commands.registerCommand(
      COMMANDS.REFETCH,
      (item?: Branch | Pipeline | Workflow | Job | Artifacts | Tests) => {
        if (!item) {
          projectTree.fetch();
        } else {
          item.controller.fetch();
        }
      }
    ),

    commands.registerCommand(
      COMMANDS.OPEN_PAGE,
      (item?: Branch | Pipeline | Workflow | Job) => {
        if (!item) {
          projectTree.openPage();
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

    commands.registerCommand(COMMANDS.CANCEL_JOB, (item: Job) => {
      item.controller.cancel();
    }),

    commands.registerCommand(COMMANDS.APPROVE_JOB, (item: Job) => {
      item.controller.approve();
    }),

    commands.registerCommand(
      COMMANDS.COPY_ID,
      (item: Job | Workflow | Pipeline) => {
        item.controller.copyId();
      }
    ),

    commands.registerCommand(COMMANDS.COPY_NUMBER, (item: Job | Pipeline) => {
      item.controller.copyNumber();
    }),

    commands.registerCommand(COMMANDS.OPEN_JOB_ARTIFACT, (item: Artifact) => {
      item.controller.open();
    }),

    commands.registerCommand(COMMANDS.OPEN_JOB_TESTS, (item: Tests) => {
      item.controller.open();
    }),
  ];
};

export default registerCommands;

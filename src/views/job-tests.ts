import { commands, Disposable, TreeItem, TreeItemCollapsibleState } from 'vscode';
import constants from '../lib/constants';
import { getAsset, l } from '../lib/utils';
import Job from './job';
import JobTestsWebView from './job-tests-webview';

export default class JobTests extends TreeItem implements Disposable {
  readonly contextValue = constants.JOB_TESTS_CONTEXT_BASE;
  private testsCommand: string;
  private testsWebView: JobTestsWebView;
  private disposed = false;
  private registeredCommand: Disposable;

  constructor(readonly job: Job) {
    super(l('viewTests', 'View Tests →'), TreeItemCollapsibleState.None);

    this.iconPath = getAsset('clipboard');
    this.testsCommand = `
      ${constants.OPEN_JOB_TESTS_COMMAND}:
      ${this.job.workflow.pipeline.gitSet.branch}:
      ${this.job.workflow.workflow.id}:
      ${this.job.job.id}
    `.replace(/(\r|\s)/gm, '');
    this.testsWebView = new JobTestsWebView(job);

    this.registeredCommand = commands.registerCommand(
      this.testsCommand,
      async () => await this.testsWebView.show()
    );

    this.command = {
      command: this.testsCommand,
      title: l('openTests', 'Open Tests'),
      arguments: [this],
    };
  }

  dispose(): void {
    this.registeredCommand.dispose();
    this.disposed = true;
  }
}

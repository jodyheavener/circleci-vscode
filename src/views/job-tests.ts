import { commands, TreeItem, TreeItemCollapsibleState } from 'vscode';
import constants from '../lib/constants';
import { getAsset, l } from '../lib/utils';
import Job from './job';
import JobTestsWebView from './job-tests-webview';

export default class JobTests extends TreeItem {
  readonly contextValue = constants.JOB_TESTS_CONTEXT_BASE;
  private testsCommand: string;
  private testsWebView: JobTestsWebView;

  constructor(readonly job: Job) {
    super(l('viewTests', 'View Tests →'), TreeItemCollapsibleState.None);

    this.iconPath = getAsset('clipboard');
    this.testsCommand = `${constants.OPEN_JOB_TESTS_COMMAND}:${this.job.job.id}`;
    this.testsWebView = new JobTestsWebView(job.job);

    commands.registerCommand(
      this.testsCommand,
      async () => await this.testsWebView.show()
    );

    this.command = {
      command: this.testsCommand,
      title: l('openTests', 'Open Tests'),
      arguments: [this],
    };
  }
}

import { JobTest as JobTestData } from 'circle-client';
import { resolve } from 'path';
import { Position, Range, Selection, Uri, window, workspace } from 'vscode';
import circleClient from '../lib/circle-client';
import constants from '../lib/constants';
import { PostMessagePayload } from '../lib/types';
import { l } from '../lib/utils';
import BaseWebView from './base-webview';
import Job from './job';

export default class JobTestsWebView extends BaseWebView {
  private loading = false;
  private tests: JobTestData[] = [];
  private nextPageToken?: string | null;

  constructor(private job: Job) {
    super();
  }

  get filename(): string {
    return 'job-tests.html';
  }

  get id(): string {
    return `${constants.JOB_TESTS_WEBVIEW_ID}:${this.job.job.id}`;
  }

  get title(): string {
    return l(
      'jobTestsTitle',
      '{0} Tests - {1}',
      this.job.job.job_number,
      this.job.job.name
    );
  }

  onDidShow(): void {
    this.getMoreTests();
  }

  async getMoreTests(): Promise<void> {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const results = await (
      await circleClient()
    ).listJobTests(this.job.job.job_number!, {
      pageToken: this.nextPageToken || undefined,
    });

    this.nextPageToken = results.next_page_token;
    this.tests.push(...results.items);
    this.loading = false;

    this.postMessage({
      event: constants.TEST_DATA_WEBVIEW_EVENT,
      data: {
        tests: results.items,
        hasMore: !!this.nextPageToken,
      },
    });
  }

  async openFile(path: string, line: number, character: number): Promise<void> {
    const fullPath = resolve(workspace.workspaceFolders![0].uri.fsPath, path);
    const openPath = Uri.file(fullPath);
    const filePosition = new Position(line, character);

    try {
      const document = await workspace.openTextDocument(openPath);
      const editor = await window.showTextDocument(document);
      editor.selections = [new Selection(filePosition, filePosition)];
      editor.revealRange(new Range(filePosition, filePosition));
    } catch (error) {
      window.showErrorMessage(
        l('openFileFail', "Couldn't open file {0}", path)
      );
      console.error(error);
    }
  }

  async onMessage(message: PostMessagePayload): Promise<void> {
    switch (message.event) {
      case constants.REQUEST_JOB_WEBVIEW_EVENT:
        this.postMessage({
          event: constants.JOB_DATA_WEBVIEW_EVENT,
          data: {
            vcs: this.job.workflow.pipeline.gitSet.vcs,
            user: this.job.workflow.pipeline.gitSet.user,
            repo: this.job.workflow.pipeline.gitSet.repo,
            pipelineNumber: this.job.workflow.workflow.pipeline_number,
            workflowId: this.job.workflow.workflow.id,
            jobName: this.job.job.name,
            jobNumber: this.job.job.job_number!,
          },
        });
        break;
      case constants.REQUEST_TESTS_WEBVIEW_EVENT:
        this.getMoreTests();
        break;
      case constants.OPEN_FILE_WEBVIEW_EVENT:
        await this.openFile(
          message.data.path,
          message.data.line || 0,
          message.data.character || 0
        );
        break;
    }
  }
}

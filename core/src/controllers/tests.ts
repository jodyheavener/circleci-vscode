import { JobTest } from 'circle-client';
import ContentSecurityPolicy from 'csp-dev';
import { Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import { client } from '../lib/circleci';
import { WEBVIEW_EVENTS } from '../lib/constants';
import { events } from '../lib/events';
import { extension } from '../lib/extension';
import { gitService } from '../lib/git-service';
import { Events } from '../lib/types';
import { Tests } from '../tree-items/tests';

const webviewId = 'circleci-tests';

export class TestsController {
  view: Tests;
  tests: JobTest[];
  private panel: WebviewPanel;
  private cspNonce: string;

  constructor(
    private jobNumber: number,
    private jobName: string,
    private pipelineNumber: number,
    private workflowId: string
  ) {
    this.view = new Tests(this);
  }

  async fetch(): Promise<void> {
    this.view.setLoading(true);
    events.fire(Events.ReloadTree, this.view);

    this.tests = (await client.listJobTests(this.jobNumber)).items;

    this.view.setFetched(this.tests.length);
    this.view.setLoading(false);

    events.fire(Events.ReloadTree, this.view);
  }

  async open(): Promise<void> {
    if (this.panel) {
      return this.panel.reveal();
    }

    this.panel = window.createWebviewPanel(
      webviewId,
      `Job #${this.jobNumber} - ${this.jobName}`,
      ViewColumn.Active,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    this.panel.webview.html = await this.getContainerHtml();

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });

    this.panel.webview.onDidReceiveMessage(async ({ type, data }) => {
      switch (type) {
        case WEBVIEW_EVENTS.WEBVIEW_READY:
          this.postTestData();
          break;
      }
    });
  }

  private async getContainerHtml(): Promise<string> {
    const isDev = process.env.NODE_ENV !== 'production';
    const scriptUri = isDev
      ? 'http://localhost:3000/static/js/main.js'
      : this.panel.webview.asWebviewUri(
          Uri.joinPath(extension.context.extensionUri, 'dist', 'container.js')
        );
    const styleUri = this.panel.webview.asWebviewUri(
      Uri.joinPath(extension.context.extensionUri, 'dist', 'container.css')
    );

    const csp = new ContentSecurityPolicy();
    csp.newDirective('default-src', 'self');
    csp.newDirective('script-src', `nonce-${this.cspNonce}`);
    csp.newDirective('img-src', '*');

    if (isDev) {
      csp.newDirective('connect-src', [
        'ws://0.0.0.0:3000',
        'vscode-webview://*',
      ]);
      csp.newDirective('style-src', 'unsafe-inline');
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        ${csp.share('html')}
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CircleCI Tests</title>
        ${isDev ? '' : `<link href="${styleUri}" rel="stylesheet" />`}
      </head>
      <body>
        <div id="app">Loading...</div>
        <script nonce="${this.cspNonce}" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }

  private postTestData(): Promise<void> {
    if (!this.panel) {
      return;
    }

    this.panel.webview.postMessage({
      type: WEBVIEW_EVENTS.JOB_DATA,
      data: {
        ready: true,
        name: this.jobName,
        pipeline_number: this.pipelineNumber,
        workflow_id: this.workflowId,
        job_number: this.jobNumber,
        tests: this.tests,
        ...gitService.data,
      },
    });
  }
}

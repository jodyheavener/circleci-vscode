import { JobTest } from 'circle-client';
import ContentSecurityPolicy from 'csp-dev';
import { Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import { client } from '../lib/circleci';
import { events } from '../lib/events';
import { extension } from '../lib/extension';
import { Events } from '../lib/types';
import { Tests } from '../tree-items/tests';

const webviewId = 'circleci-tests';

export class TestsController {
  view: Tests;
  tests: JobTest[];
  private panel: WebviewPanel;
  private cspNonce: string;

  constructor(private jobNumber: number) {
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
      'CircleCI Tests',
      ViewColumn.Active,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    this.panel.webview.html = await this.getContainerHtml();
  }

  private async getContainerHtml(): Promise<string> {
    const isDev = process.env.DEV === 'true';
    const scriptUri = this.panel.webview.asWebviewUri(
      Uri.joinPath(extension.context.extensionUri, 'dist', 'container.js')
    );
    const styleUri = this.panel.webview.asWebviewUri(
      Uri.joinPath(extension.context.extensionUri, 'dist', 'container.css')
    );

    const csp = new ContentSecurityPolicy();
    csp.newDirective('default-src', 'self');
    csp.newDirective('script-src', `nonce-${this.cspNonce}`);
    csp.newDirective('img-src', '*');

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
        <div id="root">Hey</div>
        <script nonce="${this.cspNonce}" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }
}

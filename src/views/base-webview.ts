import {
  Disposable,
  Uri,
  ViewColumn,
  WebviewPanel,
  window,
  workspace,
} from 'vscode';
import { join, resolve } from 'path';
import { getContext } from '../extension';
import { getAsset } from '../lib/utils';
import { PostMessagePayload } from '../lib/types';

export default abstract class BaseWebView implements Disposable {
  panel?: WebviewPanel;
  html?: string;

  abstract get filename(): string;
  abstract get id(): string;
  abstract get title(): string;

  get visible(): boolean {
    return this.panel ? this.panel.visible : false;
  }

  dispose(): void {
    this.panel && this.panel.dispose();
    this.panel = undefined;
  }

  setTitle(title: string): void {
    if (!this.panel) {
      return;
    }

    this.panel.title = title;
  }

  onDidShow(): void {}
  async onMessage(message: PostMessagePayload): Promise<void> {
    message;
  }

  async show(): Promise<void> {
    const html = await this.webviewHTML();

    if (this.panel) {
      this.panel.webview.html = '';
      this.panel.webview.html = html;
      this.panel.reveal(this.panel.viewColumn || ViewColumn.Active, false);
    } else {
      this.panel = window.createWebviewPanel(
        this.id,
        this.title,
        { viewColumn: ViewColumn.Active, preserveFocus: false },
        {
          retainContextWhenHidden: true,
          enableFindWidget: true,
          enableCommandUris: true,
          enableScripts: true,
        }
      );

      this.panel.onDidDispose(this.dispose.bind(this), this);
      this.panel.webview.onDidReceiveMessage(async (event) => {
        await this.onMessage(event);
      }, this);
      this.panel.webview.html = html;
      this.panel.iconPath = getAsset('circleci-logo');
    }

    this.onDidShow();
  }

  private async webviewHTML(): Promise<string> {
    let content;
    const context = getContext();
    const staticPath = resolve(context.extensionPath, 'dist');
    const filePath = join(staticPath, 'webviews', this.filename);

    if (this.html) {
      return this.html;
    }

    const doc = await workspace.openTextDocument(filePath);
    content = doc.getText();

    let html = content.replace(
      /#{root}/g,
      Uri.file(staticPath).with({ scheme: 'vscode-resource' }).toString()
    );

    this.html = html;
    return html;
  }

  postMessage(message: PostMessagePayload): Thenable<boolean> {
    if (!this.panel) {
      return Promise.resolve(false);
    }

    return this.panel.webview.postMessage(message);
  }
}

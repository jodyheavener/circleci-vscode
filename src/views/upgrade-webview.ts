import { resolve } from 'path';
import { Uri, workspace } from 'vscode';
import { getContext } from '../extension';
import constants from '../lib/constants';
import { l } from '../lib/utils';
import BaseWebView from './base-webview';

export default class UpgradeWebView extends BaseWebView {
  constructor(private version: string) {
    super();
  }

  get filename(): string {
    return 'upgrade.html';
  }

  get id(): string {
    return `${constants.UPGRADE_WEBVIEW_ID}`;
  }

  get title(): string {
    return l('upgradeTitle', 'CircleCI upgraded to v{0}', this.version);
  }

  onDidShow(): void {
    this.getContent();
  }

  async getContent(): Promise<void> {
    const document = await workspace.openTextDocument(
      Uri.file(
        resolve(getContext().extensionPath, 'CHANGELOG.md')
      )
    );

    const changelog = document.getText();

    this.postMessage({
      event: constants.CHANGELOG_CONTENT_WEBVIEW_EVENT,
      data: {
        version: this.version,
        content: changelog,
      },
    });
  }
}

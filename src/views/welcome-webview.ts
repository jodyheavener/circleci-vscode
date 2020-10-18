import { resolve } from 'path';
import { existsSync } from 'fs';
import { workspace } from 'vscode';
import config from '../lib/config';
import constants from '../lib/constants';
import { ConfigKey, PostMessagePayload } from '../lib/types';
import { l } from '../lib/utils';
import BaseWebView from './base-webview';

export default class WelcomeWebView extends BaseWebView {
  constructor(private version: string) {
    super();
  }

  get filename(): string {
    return 'welcome.html';
  }

  get id(): string {
    return `${constants.WELCOME_WEBVIEW_ID}`;
  }

  get title(): string {
    return l('welcomeTitle', 'Welcome to CircleCI for VS Code!');
  }

  onDidShow(): void {
    this.getSetupInfo();
  }

  getSetupInfo(): void {
    const basePath = workspace.workspaceFolders![0].uri.fsPath;

    const configFile = [
      'circle.yml',
      'circle.yaml',
      '.circleci/config.yml',
      '.circleci/config.yaml',
    ].find((path) => {
      return existsSync(resolve(basePath, path));
    });

    this.postMessage({
      event: constants.WELCOME_SETUP_WEBVIEW_EVENT,
      data: {
        apiToken: config().get(ConfigKey.APIToken),
        configFile,
        version: this.version,
      },
    });
  }

  async onMessage(message: PostMessagePayload): Promise<void> {
    switch (message.event) {
      case constants.UPDATE_TOKEN_WEBVIEW_EVENT:
        config().set(ConfigKey.APIToken, message.data.token);
        break;
    }
  }
}

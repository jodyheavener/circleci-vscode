import constants from '../lib/constants';
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
    this.getContent();
  }

  async getContent(): Promise<void> {
    // TODO: get changelog data for version
    const changelog = '# Changelog';

    this.postMessage({
      event: constants.CHANGELOG_CONTENT_WEBVIEW_EVENT,
      data: {
        version: this.version,
        content: changelog,
      },
    });
  }
}

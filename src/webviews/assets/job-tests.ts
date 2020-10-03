declare var window: any;
import { JobTest } from 'circle-client';
import constants from '../../lib/constants';
import { PostMessagePayload } from '../../lib/types';

class JobTests {
  vscode: { postMessage: (message: PostMessagePayload) => void };

  constructor() {
    // @ts-ignore
    this.vscode = acquireVsCodeApi();
    this.listenForEvents();
  }

  listenForEvents(): void {
    window.addEventListener(
      'message',
      ({ data }: { data: PostMessagePayload }) => {
        if (data.event === constants.TEST_DATA_WEBVIEW_EVENT) {
          this.renderTests(
            data.data.tests as JobTest[],
            data.data.hasMore as boolean
          );
        }
      }
    );
  }

  renderTests(tests: JobTest[], hasMore: boolean): void {

  }

  requestMoreTests(): void {
    this.vscode.postMessage({
      event: constants.REQUEST_TESTS_WEBVIEW_EVENT,
    });
  }
}

new JobTests();

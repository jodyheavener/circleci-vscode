import { Job as JobData, JobTest as JobTestData } from 'circle-client';
import circleClient from '../lib/circle-client';
import constants from '../lib/constants';
import { PostMessagePayload } from '../lib/types';
import { l } from '../lib/utils';
import BaseWebView from './base-webview';

export default class JobTestsWebView extends BaseWebView {
  private loading = false;
  private tests: JobTestData[] = [];
  private nextPageToken?: string | null;

  constructor(private job: JobData) {
    super();
  }

  get filename(): string {
    return 'job-tests.html';
  }

  get id(): string {
    return `${constants.JOB_TESTS_WEBVIEW_ID}:${this.job.id}`;
  }

  get title(): string {
    return l(
      'jobTestsTitle',
      `{0} Tests - {1}`,
      this.job.job_number,
      this.job.name
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

    const results = await (await circleClient()).listJobTests(
      this.job.job_number!,
      { pageToken: this.nextPageToken || undefined }
    );

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

  onMessage(message: PostMessagePayload): void {
    if (message.event === constants.REQUEST_TESTS_WEBVIEW_EVENT) {
      this.getMoreTests();
    }
  }
}

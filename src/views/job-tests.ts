import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { getAsset, pluralize } from '../lib/utils';
import Job from './job';

export default class JobTests extends TreeItem {
  readonly contextValue = 'circleciJobTests';
  private fetching = false;
  private fetched = false;

  constructor(readonly job: Job, readonly tree: CircleCITree) {
    super('Look up tests →', TreeItemCollapsibleState.None);

    this.iconPath = getAsset(this.tree.context, 'clipboard');

    this.command = {
      command: 'circleci.fetchJobTests',
      title: 'Fetch tests',
      arguments: [this],
    };
  }

  async fetchTests(): Promise<void> {
    if (this.fetching || this.fetched) {
      return;
    }

    this.fetching = true;
    const { items: tests } = await this.tree.client.listJobTests(
      this.job.job.job_number!
    );

    this.label = tests.length
      ? `${pluralize(tests.length, 'test', 'tests')}`
      : 'No tests';

    this.collapsibleState = tests.length
      ? TreeItemCollapsibleState.Expanded
      : TreeItemCollapsibleState.None;

    console.log(tests);

    this.fetching = false;
    this.fetched = true;
    this.command = undefined;
    this.job.workflow.pipeline.refresh();
  }
}

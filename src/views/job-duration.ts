import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { getAsset, msToTime } from '../lib/utils';

export default class JobDuration extends TreeItem {
  readonly contextValue = 'circleciJobDuration';

  constructor(readonly duration: number, readonly tree: CircleCITree) {
    super(msToTime(duration), TreeItemCollapsibleState.None);

    this.iconPath = getAsset(this.tree.context, 'stopwatch');
  }
}

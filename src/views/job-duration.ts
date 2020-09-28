import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { getAsset, msToTime } from '../lib/utils';

export default class JobDuration extends TreeItem {
  readonly contextValue = 'circleci-job-duration';

  constructor(readonly duration: number, readonly tree: CircleCITree) {
    super(msToTime(duration), TreeItemCollapsibleState.None);

    this.iconPath = {
      light: getAsset(this.tree.context, 'icon-time-light.svg'),
      dark: getAsset(this.tree.context, 'icon-time-dark.svg'),
    };
  }
}

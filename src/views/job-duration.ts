import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { getAsset, msToTime } from '../lib/utils';

export default class JobDuration extends TreeItem {
  readonly contextValue = 'circleciJobDuration';

  constructor(readonly duration: number) {
    super(msToTime(duration), TreeItemCollapsibleState.None);

    this.iconPath = getAsset('stopwatch');
  }
}

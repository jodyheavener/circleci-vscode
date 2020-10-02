import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import constants from '../lib/constants';
import { getAsset, msToTime } from '../lib/utils';

export default class JobDuration extends TreeItem {
  readonly contextValue = constants.JOB_DURATION_CONTEXT_BASE;

  constructor(readonly duration: number) {
    super(msToTime(duration), TreeItemCollapsibleState.None);

    this.iconPath = getAsset('stopwatch');
  }
}

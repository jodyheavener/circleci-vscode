import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { getAsset } from '../lib/utils';

export default class Empty extends TreeItem {
  readonly contextValue = 'circleci-empty-row';

  constructor(readonly item: string, readonly tree: CircleCITree) {
    super(`No ${item} found`, TreeItemCollapsibleState.None);

    this.iconPath = getAsset(this.tree.context, 'ex');
  }
}

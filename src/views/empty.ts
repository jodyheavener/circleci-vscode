import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { getAsset, localize } from '../lib/utils';

export default class Empty extends TreeItem {
  readonly contextValue = 'circleci-empty-row';

  constructor(readonly item: string, readonly tree: CircleCITree) {
    super(
      localize('circleci.noItemsFound', `No {0} found`, item),
      TreeItemCollapsibleState.None
    );

    this.iconPath = getAsset('ex');
  }
}

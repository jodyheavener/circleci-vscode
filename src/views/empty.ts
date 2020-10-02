import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { getAsset, l } from '../lib/utils';

export default class Empty extends TreeItem {
  readonly contextValue = 'circleci-empty-row';

  constructor(readonly item: string) {
    super(
      l('noItemsFound', `No {0} found`, item),
      TreeItemCollapsibleState.None
    );

    this.iconPath = getAsset('ex');
  }
}

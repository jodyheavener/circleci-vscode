import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import constants from '../lib/constants';
import { getAsset, l } from '../lib/utils';

export default class Empty extends TreeItem {
  readonly contextValue = constants.EMPTY_CONTEXT_BASE;

  constructor(readonly item: string) {
    super(
      l('noItemsFound', `No {0} found`, item),
      TreeItemCollapsibleState.None
    );

    this.iconPath = getAsset('none');
  }
}

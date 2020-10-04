import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import constants from '../lib/constants';
import { getAsset } from '../lib/utils';
import { l } from '../lib/localize';

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

import { Command, TreeItem, TreeItemCollapsibleState } from 'vscode';
import constants from '../lib/constants';
import { getAsset, l } from '../lib/utils';

export default class Loader extends TreeItem {
  readonly contextValue = constants.LOADER_CONTEXT_BASE;
  private storedCommand: Command;

  constructor(readonly itemName: string, readonly loadItems: () => void) {
    super(
      l('clickToLoadItem', 'Click to load {0}', itemName),
      TreeItemCollapsibleState.None
    );

    this.storedCommand = {
      command: constants.LOAD_ITEMS_COMMAND,
      title: l('loadItem', 'Load {0}', itemName),
      arguments: [this],
    };
    this.command = this.storedCommand;
    this.iconPath = getAsset('download');
  }

  setLoading(isLoading: boolean): void {
    this.command = isLoading ? undefined : this.storedCommand;

    this.label = isLoading
      ? l('loadingLabel', 'Loading...')
      : l('loadMoreItems', 'Load more {0}', this.itemName);
  }
}

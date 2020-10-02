import { Command, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { getAsset, l } from '../lib/utils';

export default class Loader extends TreeItem {
  readonly contextValue = 'circleci-load-items';
  private storedCommand: Command;

  constructor(readonly itemName: string, readonly loadItems: Function) {
    super(
      l('clickToLoadItem', `Click to load {0}`, itemName),
      TreeItemCollapsibleState.None
    );

    this.storedCommand = {
      command: 'circleci.loadItems',
      title: l('loadItem', `Load {0}`, itemName),
      arguments: [this],
    };
    this.command = this.storedCommand;
    this.iconPath = getAsset('download');
  }

  setLoading(isLoading: boolean): void {
    this.command = isLoading ? undefined : this.storedCommand;

    this.label = isLoading
      ? l('loadingLabel', 'Loading...')
      : l('loadMoreItems', `Load more {0}`, this.itemName);
  }
}

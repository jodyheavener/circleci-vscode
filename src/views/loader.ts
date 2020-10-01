import { Command, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { localize } from '../lib/utils';

export default class Loader extends TreeItem {
  readonly contextValue = 'circleci-load-items';
  private storedCommand: Command;

  constructor(readonly itemName: string, readonly loadItems: Function) {
    super(
      localize('circleci.clickToLoadItem', `Click to load {0}`, itemName),
      TreeItemCollapsibleState.None
    );

    this.storedCommand = {
      command: 'circleci.loadItems',
      title: localize('circleci.loadItem', `Load {0}`, itemName),
      arguments: [this],
    };
    this.command = this.storedCommand;
  }

  setLoading(isLoading: boolean): void {
    this.command = isLoading ? undefined : this.storedCommand;

    this.label = isLoading
      ? localize('circleci.loadingLabel', 'Loading...')
      : localize('circleci.loadMoreItems', `Load more {0}`, this.itemName);
  }
}

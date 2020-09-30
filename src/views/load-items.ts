import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export default class LoadItems extends TreeItem {
  readonly contextValue = 'circleci-load-rows';

  constructor(readonly item: string, readonly loadItems: Function) {
    super(`Click to load ${item}`, TreeItemCollapsibleState.None);

    this.command = {
      command: 'circleci.loadItems',
      title: `Load ${item}`,
      arguments: [this],
    };
  }
}

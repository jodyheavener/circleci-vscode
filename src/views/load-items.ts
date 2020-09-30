import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { localize } from '../lib/utils';

export default class LoadItems extends TreeItem {
  readonly contextValue = 'circleci-load-rows';

  constructor(readonly item: string, readonly loadItems: Function) {
    super(
      localize('circleci.clickToLoadItem', `Click to load {0}`, item),
      TreeItemCollapsibleState.None
    );

    this.command = {
      command: 'circleci.loadItems',
      title: localize('circleci.loadItem', `Load {0}`, item),
      arguments: [this],
    };
  }
}

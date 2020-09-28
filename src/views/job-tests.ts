import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { getAsset } from '../lib/utils';

export default class JobTests extends TreeItem {
  readonly contextValue = 'circleci-job-tests';

  constructor(readonly tree: CircleCITree) {
    super('Look up tests →', TreeItemCollapsibleState.None);

    this.iconPath = {
      light: getAsset(this.tree.context, 'icon-clipboard-light.svg'),
      dark: getAsset(this.tree.context, 'icon-clipboard-dark.svg'),
    };
  }
}

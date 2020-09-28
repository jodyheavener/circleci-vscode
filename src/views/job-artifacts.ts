import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { getAsset } from '../lib/utils';

export default class JobArtifacts extends TreeItem {
  readonly contextValue = 'circleci-job-artifacts';

  constructor(readonly tree: CircleCITree) {
    super('Look up artifacts →', TreeItemCollapsibleState.None);

    this.iconPath = {
      light: getAsset(this.tree.context, 'icon-box-light.svg'),
      dark: getAsset(this.tree.context, 'icon-box-dark.svg'),
    };
  }
}

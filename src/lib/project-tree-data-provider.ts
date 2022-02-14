import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
} from 'vscode';
import { BranchController } from '../controllers/branch';
import { Branch } from '../tree-items/branch';
// import { URLS } from './constants';
// import { events } from './events';
// import { gitService } from './git-service';
// import { Events } from './types';
// import { interpolate, openInBrowser } from './utils';

export default class ProjectTreeDataProvider
  implements TreeDataProvider<TreeItem>
{
  private _onDidChangeTreeData: EventEmitter<TreeItem | undefined> =
    new EventEmitter<TreeItem | undefined>();
  readonly onDidChangeTreeData: Event<TreeItem | undefined> =
    this._onDidChangeTreeData.event;
  branches: BranchController[] = [];

  constructor() {
    // events.on(Events.GitDataUpdate, this.setupBranches.bind(this));
    // events.on(Events.ReloadTree, this.reload.bind(this));
    // this.setupBranches();
  }

  // reload(item?: TreeItem): void {
  //   this._onDidChangeTreeData.fire(item);
  // }

  // fetch(): void {
  //   this.branches = [];
  //   this.setupBranches();
  // }

  // setupBranches(): void {
  //   this.branches = gitService.sets.map(
  //     (gitSet) => new BranchController(gitSet)
  //   );
  //   this.reload();
  // }

  // openPage(): void {
  //   const { vcs, user, repo } = gitService.data;
  //   openInBrowser(
  //     interpolate(URLS.PROJECT_URL, {
  //       vcs,
  //       user,
  //       repo,
  //     })
  //   );
  // }

  getTreeItem(element: Branch): Branch | Thenable<Branch> {
    return element;
  }

  getChildren(element?: Branch): ProviderResult<TreeItem[]> {
    if (!element) {
      return this.branches.map((branch) => branch.view);
    }

    return element.children;
  }
}

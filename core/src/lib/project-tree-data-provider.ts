import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
} from 'vscode';
import { BranchController } from '../controllers/branch';
import { PipelineController } from '../controllers/pipeline';
import { Branch } from '../tree-items/branch';
import { Pipeline } from '../tree-items/pipeline';
import { client } from './circleci';
import { configuration } from './config';
import { URLS } from './constants';
import { events } from './events';
import { gitService } from './git-service';
import { ConfigKey, Events } from './types';
import { forConfig, interpolate, openInBrowser } from './utils';

export default class ProjectTreeDataProvider
  implements TreeDataProvider<TreeItem>
{
  private _onDidChangeTreeData: EventEmitter<TreeItem | undefined> =
    new EventEmitter<TreeItem | undefined>();
  readonly onDidChangeTreeData: Event<TreeItem | undefined> =
    this._onDidChangeTreeData.event;
  treeItems: (BranchController | PipelineController)[] = [];

  constructor() {
    events.on(Events.GitDataUpdate, this.setupTree.bind(this));
    events.on(
      Events.ConfigChange,
      forConfig(ConfigKey.UseGitBranches, this.setupTree.bind(this))
    );
    events.on(Events.ReloadTree, this.reload.bind(this));

    this.setupTree();
  }

  async setupTree(): Promise<void> {
    const useBranches = configuration.get<boolean>(ConfigKey.UseGitBranches);

    if (useBranches) {
      this.treeItems = gitService.branches.map(
        (branch) => new BranchController(branch)
      );
    } else {
      this.treeItems = (await client.listProjectPipelines()).items.map(
        (pipeline) => new PipelineController(pipeline)
      );
    }

    this.reload();
  }

  reload(item?: TreeItem): void {
    this._onDidChangeTreeData.fire(item);
  }

  fetch(): void {
    this.treeItems = [];
    this.setupTree();
  }

  openPage(): void {
    const { vcs, user, repo } = gitService.data;
    openInBrowser(
      interpolate(URLS.PROJECT_URL, {
        vcs,
        user,
        repo,
      })
    );
  }

  getTreeItem(
    element: Branch | Pipeline
  ): Branch | Pipeline | Thenable<Branch | Pipeline> {
    return element;
  }

  getChildren(element?: Branch | Pipeline): ProviderResult<TreeItem[]> {
    if (!element) {
      return this.treeItems.map((item) => item.view);
    }

    return element.children;
  }
}

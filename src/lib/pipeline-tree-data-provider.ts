import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
} from 'vscode';
import { PipelineController } from '../controllers/pipeline';
import { Pipeline } from '../tree-items/pipeline';
import { URLS } from './constants';
import { events } from './events';
import { gitService } from './git-service';
import { Events } from './types';
import { interpolate, openInBrowser } from './utils';

export default class PipelineTreeDataProvider
  implements TreeDataProvider<TreeItem>
{
  private _onDidChangeTreeData: EventEmitter<TreeItem | undefined> =
    new EventEmitter<TreeItem | undefined>();
  readonly onDidChangeTreeData: Event<TreeItem | undefined> =
    this._onDidChangeTreeData.event;
  pipelines: PipelineController[] = [];

  constructor() {
    events.on(Events.GitDataUpdate, this.setupPipelines.bind(this));
    events.on(Events.ReloadTree, this.reload.bind(this));

    this.setupPipelines();
  }

  reload(item?: TreeItem): void {
    this._onDidChangeTreeData.fire(item);
  }

  fetch(): void {
    this.pipelines = [];
    this.setupPipelines();
  }

  setupPipelines(): void {
    this.pipelines = gitService.sets.map(
      (gitSet) => new PipelineController(gitSet)
    );
    this.reload();
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

  getTreeItem(element: Pipeline): Pipeline | Thenable<Pipeline> {
    return element;
  }

  getChildren(element?: Pipeline): ProviderResult<TreeItem[]> {
    if (!element) {
      return this.pipelines.map((pipeline) => pipeline.view);
    }

    return element.children;
  }
}

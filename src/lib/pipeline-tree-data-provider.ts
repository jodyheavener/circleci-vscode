import {
  Disposable,
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
} from 'vscode';
import { Artifact } from '../tree-items/artifact';
import { Artifacts } from '../tree-items/artifacts';
import { Job } from '../tree-items/job';
import { Pipeline } from '../tree-items/pipeline';
import { Timer } from '../tree-items/timer';
import { Workflow } from '../tree-items/workflow';

export default class PipelineTreeDataProvider
  implements TreeDataProvider<TreeItem>, Disposable
{
  private _onDidChangeTreeData: EventEmitter<Pipeline | undefined> =
    new EventEmitter<Pipeline | undefined>();
  readonly onDidChangeTreeData: Event<Pipeline | undefined> =
    this._onDidChangeTreeData.event;

  dispose(): void {
    // Nothing to do here
  }

  getTreeItem(element: Pipeline): Pipeline | Thenable<Pipeline> {
    return element;
  }

  getChildren(element?: Pipeline): ProviderResult<TreeItem[]> {
    if (!element) {
      return [
        new Pipeline('main', 'repo/branch'),
        new Workflow('test'),
        new Job('deploy-packages'),
        new Timer(20000),
        new Artifacts(),
        new Artifact('package.json'),
        new Artifact('example.jpg'),
        new Artifact('data.zip'),
        new Artifact('something.else'),
      ];
    }

    return element.children;
  }
}

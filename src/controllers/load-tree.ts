import { circleci } from '../lib/circleci';
import { events } from '../lib/events';
import ProjectTreeDataProvider from '../lib/project-tree-data-provider';
import { Events } from '../lib/types';
import { LoadTree } from '../tree-items/load-tree';

export class LoadTreeController {
  view: LoadTree;

  constructor(private treeDataProvider: ProjectTreeDataProvider) {
    this.view = new LoadTree(this);

    events.on(Events.OPFailure, () => {
      this.view.setLoading(false);
      this.view.setLabel('Problem loading. Try again.');
      events.fire(Events.ReloadTree, this.view);
    });
  }

  async loadTree(): Promise<void> {
    this.view.setLoading(true);
    events.fire(Events.ReloadTree, this.view);

    await circleci.configure(true);

    this.treeDataProvider.treeLoaded = true;
    this.treeDataProvider.fetch();
  }
}

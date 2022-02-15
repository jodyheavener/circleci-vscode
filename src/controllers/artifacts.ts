import { client } from '../lib/circleci';
import { events } from '../lib/events';
import { Events } from '../lib/types';
import { Artifacts } from '../tree-items/artifacts';
import { ArtifactController } from './artifact';

export class ArtifactsController {
  view: Artifacts;
  artifacts: ArtifactController[];

  constructor(private jobNumber: number) {
    this.view = new Artifacts(this);
  }

  async fetch(): Promise<void> {
    this.view.setLoading(true);
    events.fire(Events.ReloadTree, this.view);

    this.artifacts = (await client.listJobArtifacts(this.jobNumber)).items.map(
      (artifact) => new ArtifactController(artifact)
    );

    this.view.children = this.artifacts.map((artifact) => artifact.view);
    this.view.setFetched(this.artifacts.length);
    this.view.setLoading(false);

    events.fire(Events.ReloadTree, this.view);
  }
}

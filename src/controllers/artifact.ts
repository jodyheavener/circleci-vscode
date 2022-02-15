import { JobArtifact } from 'circle-client';
import { Artifact } from '../tree-items/artifact';

export class ArtifactController {
  view: Artifact;

  constructor(private data: JobArtifact) {
    this.view = new Artifact(data.url);
  }
}

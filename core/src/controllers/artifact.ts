import { JobArtifact } from 'circle-client';
import { existsSync } from 'fs';
import open from 'open';
import { basename, resolve } from 'path';
import { window, workspace } from 'vscode';
import { client } from '../lib/circleci';
import { extension } from '../lib/extension';
import { Artifact } from '../tree-items/artifact';

export class ArtifactController {
  view: Artifact;
  private downloading = false;
  private downloadPath?: string;

  constructor(private data: JobArtifact) {
    this.view = new Artifact(this, data.url);
  }

  async open(): Promise<void> {
    if (this.downloading) {
      return;
    }

    const downloadPath = resolve(
      extension.workspacePath,
      basename(this.data.path)
    );

    if (!this.downloadPath || !existsSync(this.downloadPath)) {
      this.downloading = true;
      await client.downloadArtifact(this.data.url, downloadPath);
      this.downloadPath = downloadPath;
      this.downloading = false;
    }

    try {
      const document = await workspace.openTextDocument(this.downloadPath);
      await window.showTextDocument(document);
    } catch (error) {
      await open(this.downloadPath, { wait: true });
    }
  }
}

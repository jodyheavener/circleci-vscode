import { JobArtifact as JobArtifactData } from 'circle-client';
import {
  TreeItem,
  TreeItemCollapsibleState,
  Uri,
  window,
  workspace,
} from 'vscode';
import CircleCITree from '../lib/circleci-tree';
import { downloadFile, getAsset, l } from '../lib/utils';
import Job from './job';

const fileTypeIcons: {
  [status: string]: string;
} = {
  jpg: 'file-image',
  jpeg: 'file-image',
  png: 'file-image',
  gif: 'file-image',
  svg: 'file-code',
  html: 'file-code',
  css: 'file-code',
  js: 'file-code',
  zip: 'file-archive',
  rar: 'file-archive',
};

function stripPathPrefix(path: string): string {
  return path.replace('artifacts/', '');
}

function getfileTypeIcon(path: string): string {
  const ext = path.split('.').pop();
  if (ext) {
    const iconType = fileTypeIcons[ext] || 'file-generic';
    return iconType;
  } else {
    return 'file-generic';
  }
}

export default class JobArtifact extends TreeItem {
  readonly contextValue = 'circleciJobArtifact';
  private downloading = false;
  private fileData?: string;

  constructor(
    readonly artifact: JobArtifactData,
    readonly job: Job,
    readonly tree: CircleCITree
  ) {
    super(stripPathPrefix(artifact.path), TreeItemCollapsibleState.None);

    this.iconPath = getAsset(getfileTypeIcon(artifact.path));

    this.command = {
      command: 'circleci.openJobArtifact',
      title: l('openArtifact', 'Open Artifact'),
      arguments: [this],
    };
  }

  async openJobArtifact(): Promise<void> {
    if (this.downloading) {
      return;
    }
    this.downloading = true;

    if (!this.fileData) {
      try {
        this.fileData = await downloadFile(this.artifact.url);
        this.downloading = false;
      } catch (error) {
        console.error(error.stack);
        window.showErrorMessage(
          l(
            'downloadArtifactError',
            'Could not download Artifact: {0}',
            this.artifact.path
          )
        );
      }
    }

    if (this.fileData) {
      const uri = Uri.parse(`circleci:${encodeURIComponent(this.fileData)}`);
      const doc = await workspace.openTextDocument(uri);
      await window.showTextDocument(doc, { preview: false });

      this.description = l('artifactDownloaded', 'Downloaded');
      this.job.workflow.pipeline.refresh();
    }
  }
}

import { TreeItem, TreeItemCollapsibleState, window, workspace } from 'vscode';
import { createWriteStream } from 'fs';
import { IncomingMessage } from 'http';
import { JobArtifact as JobArtifactData } from 'circle-client';
import { downloadFile, getAsset, l } from '../lib/utils';
import constants from '../lib/constants';
import Job from './job';
import { FollowResponse } from 'follow-redirects';
import { basename, resolve } from 'path';

const extensionIcons: { [icon: string]: string[] } = {
  'file-image': ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  'file-code': ['svg', 'html', 'css', 'js', 'json'],
  'file-archive': ['zip', 'rar'],
};

const textType = {
  'text/html': 'html',
  'text/plain': 'plaintext',
  'application/javascript': 'javascript',
  'application/json': 'json',
  'text/css': 'css',
};

const imageType = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

function getfileTypeIcon(path: string): string {
  const ext = path.split('.').pop();
  if (ext) {
    return (
      Object.keys(extensionIcons).find((key) =>
        extensionIcons[key].includes(ext)
      ) || 'file-generic'
    );
  } else {
    return 'file-generic';
  }
}

export default class JobArtifact extends TreeItem {
  readonly contextValue = constants.JOB_ARTIFACT_CONTEXT_BASE;
  private downloading = false;
  private download?: {
    contentType?: string | undefined;
    data: string;
    response: IncomingMessage & FollowResponse;
  };

  constructor(readonly artifact: JobArtifactData, readonly job: Job) {
    super(basename(artifact.path), TreeItemCollapsibleState.None);

    this.iconPath = getAsset(getfileTypeIcon(artifact.path));

    this.command = {
      command: constants.OPEN_JOB_ARTIFACT_COMMAND,
      title: l('openArtifact', 'Open Artifact'),
      arguments: [this],
    };
  }

  async openJobArtifact(): Promise<void> {
    if (this.downloading) {
      return;
    }
    this.downloading = true;

    if (!this.download) {
      try {
        this.download = await downloadFile(this.artifact.url);
        this.downloading = false;
      } catch (error) {
        console.error(error);
        window.showErrorMessage(
          l(
            'downloadArtifactError',
            'Could not download Artifact: {0}',
            this.artifact.path
          )
        );
      }
    }

    if (!this.download) {
      window.showErrorMessage(
        l(
          'downloadArtifactError',
          'Could not download Artifact: {0}',
          this.artifact.path
        )
      );
    }

    const downloadLocation = resolve(
      workspace.workspaceFolders![0].uri.fsPath,
      basename(this.artifact.path)
    );

    const downloadToWorkspace = async (): Promise<void> => {
      const file = createWriteStream(downloadLocation);
      this.download!.response.pipe(file);
      this.download!.response.on('finish', () => {
        Promise.resolve();
      });

      window.showInformationMessage(
        l(
          'downloadedToWorkspace',
          'Artifact downloaded to Workspace path: {0}',
          this.artifact.path
        )
      );
    };

    if (this.download!.contentType) {
      if (Object.keys(textType).includes(this.download!.contentType)) {
        const document = await workspace.openTextDocument({
          content: this.download?.data,
        });
        await window.showTextDocument(document);
      } else if (imageType.includes(this.download!.contentType)) {
        // TODO: download and show image
        // for now just download
        await downloadToWorkspace();
      } else {
        await downloadToWorkspace();
      }
    } else {
      await downloadToWorkspace();
    }

    this.description = l('artifactDownloaded', 'Downloaded');
    this.job.workflow.pipeline.refresh();
  }
}

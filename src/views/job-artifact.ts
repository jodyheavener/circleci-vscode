import { TreeItem, TreeItemCollapsibleState, window, workspace } from 'vscode';
import { JobArtifact as JobArtifactData } from 'circle-client';
import { downloadFile, getAsset, l, openInOS } from '../lib/utils';
import constants from '../lib/constants';
import Job from './job';
import { basename, resolve } from 'path';

const extensionIcons: { [icon: string]: string[] } = {
  'file-image': ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  'file-code': ['svg', 'html', 'css', 'js', 'json'],
  'file-archive': ['zip', 'rar'],
};

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
  private downloadLocation?: string;

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

    const downloadLocation = resolve(
      workspace.workspaceFolders![0].uri.fsPath,
      basename(this.artifact.path)
    );

    if (!this.downloadLocation) {
      try {
        await downloadFile(this.artifact.url, downloadLocation);
        this.downloadLocation = downloadLocation;
        this.downloading = false;

        window.showInformationMessage(
          l(
            'downloadedToWorkspace',
            'Artifact downloaded to Workspace: {0}',
            basename(this.artifact.path)
          )
        );
      } catch (error) {
        console.error(error);
        return void window.showErrorMessage(
          l(
            'downloadArtifactError',
            'Could not download Artifact: {0}',
            this.artifact.path
          )
        );
      }
    }

    try {
      const document = await workspace.openTextDocument(this.downloadLocation);
      await window.showTextDocument(document);
    } catch (error) {
      await openInOS(this.downloadLocation);
    }

    this.description = l('artifactDownloaded', 'Downloaded');
    this.job.workflow.pipeline.refresh();
  }
}

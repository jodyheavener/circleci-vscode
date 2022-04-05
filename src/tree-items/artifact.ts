import { ArtifactController } from '../controllers/artifact';
import { COMMANDS, CONTEXTS } from '../lib/constants';
import { Base } from './base';

const extensionIcons: { [icon: string]: string[] } = {
  'file-image': ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  'file-code': ['svg', 'html', 'css', 'js', 'json'],
  'file-archive': ['zip', 'rar'],
};

const getfileTypeIcon = (path: string): string => {
  const ext = path.split('.').pop();
  return (
    Object.keys(extensionIcons).find((key) =>
      extensionIcons[key].includes(ext)
    ) || 'file-generic'
  );
};

export class Artifact extends Base {
  constructor(public controller: ArtifactController, filename: string) {
    super({
      label: filename.split('/').pop(),
      contextValue: CONTEXTS.ARTIFACT_BASE,
      iconName: getfileTypeIcon(filename),
    });

    this.setCommand(COMMANDS.OPEN_JOB_ARTIFACT, 'Open artifact');
  }
}

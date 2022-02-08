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
  constructor(filename: string) {
    super({ label: filename, iconName: getfileTypeIcon(filename) });
  }
}

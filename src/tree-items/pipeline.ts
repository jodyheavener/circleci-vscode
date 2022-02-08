import { pluralize } from '../lib/utils';
import { Base } from './base';

export class Pipeline extends Base {
  storedLabel: string;

  static activePrefix = '⭐️ ';

  constructor(label: string) {
    super({ label, iconName: 'pipeline', loadable: true });

    this.storedLabel = label;

    // TODO: move this to when children are updated
    this.setDescription(pluralize('Workflow', this.children.length));
  }

  setActive(active: boolean): void {
    this.setLabel(`${active ? Pipeline.activePrefix : ''}${this.storedLabel}`);
  }
}

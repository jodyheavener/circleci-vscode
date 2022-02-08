import { pluralize } from '../lib/utils';
import { Base } from './base';

export class Artifacts extends Base {
  constructor() {
    super({ label: 'Look up Artifacts →', iconName: 'box' });
  }

  setFetched(count: number): void {
    this.setLabel(pluralize('Artifact', count));
  }
}

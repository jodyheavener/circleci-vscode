import { ActivityStatus } from '../lib/types';
import { Base } from './base';

export class Workflow extends Base {
  constructor(label: string) {
    super({ label, iconName: 'workflow', loadable: true });

    this.setDescription(ActivityStatus.NotRun);
  }

  setStatus(status: ActivityStatus): void {
    this.setDescription(status);
  }
}

import { COMMANDS, CONTEXTS } from '../lib/constants';
import { pluralize } from '../lib/utils';
import { Base } from './base';

export class Artifacts extends Base {
  constructor() {
    super({
      label: 'Look up Artifacts →',
      contextValue: CONTEXTS.ARTIFACTS_BASE,
      iconName: 'box',
    });

    // TODO: reset once artifacts are fetched
    this.setCommand(COMMANDS.FETCH_JOB_ARTIFACTS, 'Fetch Artifacts');
  }

  setFetched(count: number): void {
    this.setLabel(pluralize('Artifact', count));
  }
}

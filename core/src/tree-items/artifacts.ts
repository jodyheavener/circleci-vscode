import { ArtifactsController } from '../controllers/artifacts';
import { COMMANDS, CONTEXTS } from '../lib/constants';
import { pluralize } from '../lib/utils';
import { Base } from './base';

export class Artifacts extends Base {
  constructor(public controller: ArtifactsController) {
    super({
      label: 'Fetch artifacts →',
      contextValue: CONTEXTS.ARTIFACTS_BASE,
      iconName: 'box',
      loadable: true,
    });

    this.setCommand(COMMANDS.REFETCH, 'Fetch artifacts');
  }

  setFetched(count: number): void {
    this.setLabel(pluralize('artifact', count));
    this.setCommand();
  }
}

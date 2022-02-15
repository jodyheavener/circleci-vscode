import { TestsController } from '../controllers/tests';
import { COMMANDS, CONTEXTS } from '../lib/constants';
import { pluralize } from '../lib/utils';
import { Base } from './base';

export class Tests extends Base {
  constructor(public controller: TestsController) {
    super({
      label: 'Fetch tests →',
      contextValue: CONTEXTS.TESTS_BASE,
      iconName: 'clipboard',
      loadable: true,
    });

    this.setCommand(COMMANDS.REFETCH, 'Fetch tests');
  }

  setFetched(count: number): void {
    this.setLabel(`${pluralize('test', count)} →`);
    this.setCommand();
  }
}

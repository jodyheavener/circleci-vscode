import { COMMANDS, CONTEXTS } from '../lib/constants';
import { Base } from './base';

export class Tests extends Base {
  constructor() {
    super({
      label: 'Look up Tests →',
      contextValue: CONTEXTS.TESTS_BASE,
      iconName: 'clipboard',
    });

    this.setCommand(COMMANDS.LOAD_JOB_TESTS, 'Fetch Tests');
  }
}

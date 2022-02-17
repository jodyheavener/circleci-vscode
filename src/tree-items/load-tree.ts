import { LoadTreeController } from '../controllers/load-tree';
import { COMMANDS } from '../lib/constants';
import { Base } from './base';

export class LoadTree extends Base {
  constructor(public controller: LoadTreeController) {
    super({
      label: 'Click to load tree using 1Password',
      iconName: 'play',
      loadable: true,
    });
    this.setCommand(COMMANDS.LOAD_TREE, 'Load tree');
  }
}

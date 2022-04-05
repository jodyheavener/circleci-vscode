import { BranchController } from '../controllers/branch';
import { CONTEXTS } from '../lib/constants';
import { Base } from './base';

export class Branch extends Base {
  storedLabel: string;
  storedTooltip: string;

  static activePrefix = '★ ';
  static activeLabel = '(Active branch) ';

  constructor(
    public controller: BranchController,
    label: string,
    tooltip: string
  ) {
    super({
      label,
      tooltip,
      contextValue: CONTEXTS.BRANCH_BASE,
      iconName: 'branch',
      loadable: true,
    });

    this.storedLabel = label;
    this.storedTooltip = tooltip;
  }

  setActive(active: boolean): void {
    this.setLabel(`${active ? Branch.activePrefix : ''}${this.storedLabel}`);
    this.setTooltip(`${active ? Branch.activeLabel : ''}${this.storedTooltip}`);
  }
}

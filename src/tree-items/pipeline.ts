import { PipelineController } from '../controllers/pipeline';
import { CONTEXTS } from '../lib/constants';
import { pluralize } from '../lib/utils';
import { Base } from './base';

export class Pipeline extends Base {
  storedLabel: string;
  storedTooltip: string;

  static activePrefix = '★ ';
  static activeLabel = '(Active branch) ';

  constructor(
    public controller: PipelineController,
    label: string,
    tooltip: string
  ) {
    super({
      label,
      tooltip,
      contextValue: CONTEXTS.PIPELINE_BASE,
      iconName: 'pipeline',
      loadable: true,
    });

    this.storedLabel = label;
    this.storedTooltip = tooltip;
  }

  setActive(active: boolean): void {
    this.setLabel(`${active ? Pipeline.activePrefix : ''}${this.storedLabel}`);
    this.setTooltip(
      `${active ? Pipeline.activeLabel : ''}${this.storedTooltip}`
    );
  }

  updateWorkflowCount(): void {
    super.setDescription(pluralize('Workflow', this.children.length));
  }
}

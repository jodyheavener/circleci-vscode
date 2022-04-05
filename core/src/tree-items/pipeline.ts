import { PipelineController } from '../controllers/pipeline';
import { CONTEXTS } from '../lib/constants';
import { Base } from './base';

export class Pipeline extends Base {
  constructor(
    public controller: PipelineController,
    label: string,
    description: string,
    tooltip: string
  ) {
    super({
      label,
      description,
      tooltip,
      contextValue: CONTEXTS.PIPELINE_BASE,
      iconName: 'pipeline',
      loadable: true,
    });
  }
}

import { WorkflowController } from '../controllers/workflow';
import { CONTEXTS } from '../lib/constants';
import { ActivityStatus } from '../lib/types';
import { Base } from './base';

export class Workflow extends Base {
  constructor(public controller: WorkflowController, label: string) {
    super({
      label,
      contextValue: CONTEXTS.WORKFLOW_BASE,
      iconName: 'workflow',
      loadable: true,
    });

    this.setDescription(ActivityStatus.NotRun);
  }

  setStatus(status: ActivityStatus): void {
    this.setDescription(status);
    this.setContextValue(status);
  }

  setContextValue(status: ActivityStatus): void {
    let contextValue = CONTEXTS.WORKFLOW_BASE;

    switch (status) {
      case ActivityStatus.Running:
        contextValue += ':running';
        break;
      case ActivityStatus.Failing:
        contextValue += ':failing';
        break;
      case ActivityStatus.Failed:
        contextValue += ':failed';
        break;
      default:
        break;
    }

    this.contextValue = contextValue;
  }
}

import { JobType } from 'circle-client';
import { JobController } from '../controllers/job';
import { CONTEXTS } from '../lib/constants';
import { ActivityStatus } from '../lib/types';
import { Base } from './base';

export const statusIcons: {
  [status: string]: string;
} = {
  [ActivityStatus.Success]: 'status-check',
  [ActivityStatus.Running]: 'status-dots-blue',
  [ActivityStatus.NotRun]: 'status-line',
  [ActivityStatus.Failed]: 'status-exclaim',
  [ActivityStatus.Error]: 'status-exclaim',
  [ActivityStatus.Failing]: 'status-exclaim',
  [ActivityStatus.OnHold]: 'status-dots-grey',
  [ActivityStatus.Canceled]: 'status-line',
  [ActivityStatus.Unauthorized]: 'status-line',
  [ActivityStatus.OnHold]: 'status-pause',
  [ActivityStatus.Queued]: 'status-dots-grey',
  unknown: 'status-unknown',
  loading: 'status-dots-grey',
};

export class Job extends Base {
  status: ActivityStatus;

  constructor(
    public controller: JobController,
    label: string,
    status: ActivityStatus,
    private jobType: JobType
  ) {
    super({ label, contextValue: CONTEXTS.JOB_BASE, loadable: true });

    this.setStatus(status);
  }

  setStatus(status: ActivityStatus): void {
    this.status = status;
    this.setDescription(status);
    this.setIconName(statusIcons[status] ?? statusIcons.unknown);
    this.setContextValue(status);
  }

  setContextValue(status: ActivityStatus): void {
    let contextValue = CONTEXTS.JOB_BASE;

    switch (this.jobType) {
      case JobType.Approval:
        contextValue += ':approval';
        break;
      case JobType.Build:
        contextValue += ':build';
        break;
      default:
        break;
    }

    if (status === ActivityStatus.Running) {
      contextValue += ':running';
    }

    this.contextValue = contextValue;
  }
}

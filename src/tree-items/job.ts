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
  unknown: 'status-unknown',
  loading: 'status-dots-grey',
};

export class Job extends Base {
  status: ActivityStatus;

  constructor(label: string) {
    super({ label, contextValue: CONTEXTS.JOB_BASE, loadable: true });

    this.setStatus(ActivityStatus.NotRun);
  }

  setLoading(loading: boolean): void {
    super.render(() => {
      this.loading = loading;
      this.iconPath =
        statusIcons[loading ? 'loading' : this.status ?? 'unknown'];
    });
  }

  setStatus(status: ActivityStatus): void {
    this.status = status;
    this.setDescription(status);
    this.setIconName(statusIcons[status] ?? statusIcons.unknown);
    this.setContextValue(status);
  }

  setContextValue(status: ActivityStatus): void {
    let contextValue = CONTEXTS.JOB_BASE;

    // TODO: add job types
    // switch (this.jobType) {
    //   case JobType.Approval:
    //     contextValue += ':approval';
    //     break;
    //   case JobType.Build:
    //     contextValue += ':build';
    //     break;
    //   default:
    //     break;
    // }

    if (status === ActivityStatus.Running) {
      contextValue += ':running';
    }

    this.contextValue = contextValue;
  }
}

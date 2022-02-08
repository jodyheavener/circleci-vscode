import { msToTime } from '../lib/utils';
import { Base } from './base';

export class Timer extends Base {
  constructor(duration: number) {
    super({ label: msToTime(duration), iconName: 'stopwatch' });
  }
}

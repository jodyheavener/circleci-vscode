import { CONTEXTS } from '../lib/constants';
import { msToTime } from '../lib/utils';
import { Base } from './base';

export class Timer extends Base {
  constructor(duration: number) {
    super({
      label: msToTime(duration),
      contextValue: CONTEXTS.TIMER_BASE,
      iconName: 'stopwatch',
    });
  }
}

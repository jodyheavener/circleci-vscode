import { CONTEXTS } from '../lib/constants';
import { assertBadTreeItemLoad, assertTreeItem } from '../test/utils';
import { Timer } from './timer';

describe('Timer', () => {
  let item: Timer;

  beforeEach(() => {
    item = new Timer(120000);
  });

  it('returns the correct properties', () => {
    assertTreeItem(item, {
      label: '2m',
      icon: 'stopwatch',
      contextValue: CONTEXTS.TIMER_BASE,
    });
  });

  it('cannot set loading', () => {
    assertBadTreeItemLoad(item);
  });
});

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
    });
  });

  it('cannot set loading', () => {
    assertBadTreeItemLoad(item);
  });
});

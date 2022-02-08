import { ActivityStatus } from '../lib/types';
import { assertTreeItem, assertTreeItemLoad } from '../test/utils';
import { Job, statusIcons } from './job';

describe('Job', () => {
  let item: Job;

  beforeEach(() => {
    item = new Job('foo');
  });

  it('returns the correct default properties', () => {
    assertTreeItem(item, {
      label: 'foo',
      icon: statusIcons[ActivityStatus.NotRun],
      loading: false,
    });
  });

  it('can be set to loading', () => {
    assertTreeItemLoad(item);
  });

  it('can set description and icon based on activity status', () => {
    for (const status of Object.values(ActivityStatus)) {
      item.setStatus(status);
      assertTreeItem(item, {
        description: status,
        icon: statusIcons[status],
      });
    }
  });
});

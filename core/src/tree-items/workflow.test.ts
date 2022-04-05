import { CONTEXTS } from '../lib/constants';
import { ActivityStatus } from '../lib/types';
import { assertTreeItem, assertTreeItemLoad } from '../test/utils';
import { Workflow } from './workflow';

describe('Workflow', () => {
  let item: Workflow;

  beforeEach(() => {
    item = new Workflow('foo');
  });

  it('returns the correct default properties', () => {
    assertTreeItem(item, {
      label: 'foo',
      description: ActivityStatus.NotRun,
      contextValue: CONTEXTS.WORKFLOW_BASE,
      icon: 'workflow',
      loading: false,
    });
  });

  it('can be set to loading', () => {
    assertTreeItemLoad(item);
  });

  it('can set description based on activity status', () => {
    for (const status of Object.values(ActivityStatus)) {
      item.setStatus(status);
      assertTreeItem(item, {
        description: status,
      });
    }
  });
});

import { assertTreeItem, assertTreeItemLoad } from '../test/utils';
import { Pipeline } from './pipeline';

describe('Pipeline', () => {
  let item: Pipeline;

  beforeEach(() => {
    item = new Pipeline('foo');
  });

  it('returns the correct default properties', () => {
    assertTreeItem(item, {
      label: 'foo',
      icon: 'pipeline',
      loading: false,
      // TODO: test this when children are updated
      // description: 'TODO',
    });
  });

  it('can be set to loading', () => {
    assertTreeItemLoad(item);
  });

  it('can set label based on active status', () => {
    item.setActive(true);
    assertTreeItem(item, {
      label: `${Pipeline.activePrefix}foo`,
    });

    item.setActive(false);
    assertTreeItem(item, {
      label: 'foo',
    });
  });
});

import { CONTEXTS } from '../lib/constants';
import { assertBadTreeItemLoad, assertTreeItem } from '../test/utils';
import { Artifacts } from './artifacts';

describe('Artifacts', () => {
  let item: Artifacts;

  beforeEach(() => {
    item = new Artifacts();
  });

  it('returns the correct default properties', () => {
    assertTreeItem(item, {
      label: 'Look up Artifacts →',
      icon: 'box',
      contextValue: CONTEXTS.ARTIFACTS_BASE,
    });
  });

  it('cannot set loading', () => {
    assertBadTreeItemLoad(item);
  });

  it('can set the label with a render count', () => {
    item.setFetched(2);
    assertTreeItem(item, {
      label: '2 Artifacts',
    });
  });
});

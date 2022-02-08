import { assertBadTreeItemLoad, assertTreeItem } from '../test/utils';
import { Artifact } from './artifact';

describe('Artifact', () => {
  it('returns the correct properties', () => {
    assertTreeItem(new Artifact('foo'), {
      label: 'foo',
      icon: 'file-generic',
    });
  });

  it('cannot set loading', () => {
    assertBadTreeItemLoad(new Artifact('foo'));
  });

  it('sets the code icon', () => {
    assertTreeItem(new Artifact('package.json'), {
      icon: 'file-code',
    });

    assertTreeItem(new Artifact('package.html'), {
      icon: 'file-code',
    });
  });

  it('sets the image icon', () => {
    assertTreeItem(new Artifact('meme.gif'), {
      icon: 'file-image',
    });

    assertTreeItem(new Artifact('artifact.jpg'), {
      icon: 'file-image',
    });
  });

  it('sets the archive icon', () => {
    assertTreeItem(new Artifact('data.zip'), {
      icon: 'file-archive',
    });

    assertTreeItem(new Artifact('artifacts.rar'), {
      icon: 'file-archive',
    });
  });
});

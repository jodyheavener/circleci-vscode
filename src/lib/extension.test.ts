import { context } from '../test/setup';
import { Extension } from './extension';

describe('Extension', () => {
  it('can be instantiated', () => {
    expect(() => new Extension()).not.toThrowError();
  });

  it('can be configured with context', () => {
    const extension = new Extension();
    extension.configure(context);
    expect(extension.context).toBe(context);
  });
});

import { extensionPath } from '../test/setup';
import { getImage, msToTime, pluralize } from './utils';

describe('getImage', () => {
  it('returns the correct light and dark image paths', () => {
    const imageBase = `${extensionPath}/dist/images`;
    const fileBase = 'bird';
    expect(getImage(fileBase)).toEqual({
      light: expect.stringContaining(`${imageBase}/light/${fileBase}.svg`),
      dark: expect.stringContaining(`${imageBase}/dark/${fileBase}.svg`),
    });
  });
});

describe('pluralize', () => {
  it('formats a string with 0 count', () => {
    expect(pluralize('cat', 0)).toEqual('0 cats');
  });

  it('formats a string with 1 count', () => {
    expect(pluralize('person', 1)).toEqual('1 person');
  });

  it('formats a string with 2 count', () => {
    expect(pluralize('dog', 2)).toEqual('2 dogs');
  });
});

describe('msToTime', () => {
  it('outputs just seconds when below a minute', () => {
    expect(msToTime(1000)).toEqual('1s');
    expect(msToTime(30000)).toEqual('30s');
  });

  it('outputs just minutes when on exact minutes', () => {
    expect(msToTime(60000)).toEqual('1m');
    expect(msToTime(120000)).toEqual('2m');
  });

  it('outputs minutes and seconds otherwise', () => {
    expect(msToTime(90000)).toEqual('1m 30s');
    expect(msToTime(150000)).toEqual('2m 30s');
  });
});

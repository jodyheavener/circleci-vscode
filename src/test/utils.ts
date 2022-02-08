import { Base } from '../tree-items/base';

export const assertTreeItem = (
  item: Base,
  fields: Partial<{
    label: string;
    description: string;
    icon: string;
    loading: boolean;
  }>
): void => {
  const { icon, ...otherFields } = fields;
  for (const key in otherFields) {
    expect(item[key]).toEqual(otherFields[key]);
  }

  if (icon) {
    expect(item.iconPath).toEqual({
      light: expect.stringContaining(`/light/${icon}.svg`),
      dark: expect.stringContaining(`/dark/${icon}.svg`),
    });
  }
};

export const assertTreeItemLoad = (item: Base): void => {
  const { activeLabel, activeDescription } = item;

  item.setLoading(true);
  assertTreeItem(item, {
    label: 'Loading...',
    description: undefined,
    loading: true,
  });

  item.setLoading(false);
  assertTreeItem(item, {
    label: activeLabel,
    description: activeDescription,
    loading: false,
  });
};

export const assertBadTreeItemLoad = (item: Base): void => {
  expect(() => item.setLoading(true)).toThrowError(Base.invalidLoad);
};

import * as nls from 'vscode-nls';
import constants from './constants';

export function l(
  key: string | nls.LocalizeInfo,
  message: string,
  ...args: (string | number | boolean | undefined | null)[]
): string {
  if (typeof key === 'string') {
    return nls.config()()(
      `${constants.LOCALIZATION_PREFIX}.${key}`,
      message,
      ...args
    );
  } else {
    return nls.config()()(key, message, ...args);
  }
}

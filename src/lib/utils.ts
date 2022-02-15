import { execSync } from 'child_process';
import open from 'open';
import { resolve } from 'path';
import { Uri } from 'vscode';
import { extension } from './extension';
import { ConfigItems, ConfigKey } from './types';

export const getAsset = (name: string): { light: Uri; dark: Uri } => ({
  light: Uri.file(
    resolve(
      extension.context.extensionPath,
      'dist',
      'assets',
      'light',
      `${name}.svg`
    )
  ),
  dark: Uri.file(
    resolve(
      extension.context.extensionPath,
      'dist',
      'assets',
      'dark',
      `${name}.svg`
    )
  ),
});

export const pluralize = (word: string, count: number): string =>
  `${count} ${word}${count === 1 ? '' : 's'}`;

export const msToTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Number(((milliseconds % 60000) / 1000).toFixed(0));

  let output = '';

  if (minutes > 0) {
    output = `${minutes}m`;
  }

  if (seconds > 0) {
    output = output.length ? `${output} ${seconds}s` : `${seconds}s`;
  }

  return output;
};

export const timeSince = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (minutes < 60) {
    return `${minutes} minutes`;
  } else if (hours < 24) {
    return `${hours} hours`;
  } else {
    return `${days} days`;
  }
};

export const execCommand = (cmd: string, cwd: string): string => {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8' });
  } catch (error) {
    console.error(error);
    throw new Error('Error executing command.');
  }
};

export const stripNewline = (value: string): string =>
  value.replace(/\n|\r/g, '');

export const interpolate = (
  value: string,
  replacements: { [key: string]: string | number }
): string =>
  Object.keys(replacements).reduce(
    (p, c) => p.split('{' + c + '}').join(String(replacements[c])),
    value
  );

export const openInBrowser = (url: string): void => {
  try {
    open(url);
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't open URL.");
  }
};

export const forConfig = (
  key: ConfigKey,
  cb: (value: ConfigItems[ConfigKey]) => void
) => {
  return (data: { key: ConfigKey; value: ConfigItems[ConfigKey] }): void => {
    if (data.key === key) {
      cb(data.value);
    }
  };
};

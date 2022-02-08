import { resolve } from 'path';
import { Uri } from 'vscode';
import extension from './extension';

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

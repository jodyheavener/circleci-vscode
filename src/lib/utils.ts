import { https } from 'follow-redirects';
import { resolve } from 'path';
import { ExtensionContext, window } from 'vscode';
import { exec } from 'child_process';
import open from 'open';
import * as nls from 'vscode-nls';

export const localize: nls.LocalizeFunc = nls.config()();

export const statusDescriptions: {
  [status: string]: string;
} = {
  success: 'Success',
  running: 'Running',
  not_run: 'Not Run',
  failed: 'Failed',
  error: 'Exclaim',
  failing: 'Failing',
  on_hold: 'On Hold',
  canceled: 'Canceled',
  unauthorized: 'Unauthorized',
};

export function pluralize(
  count: number,
  singular: string,
  plural: string
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function humanize(word: string): string {
  return word.replace(/\b\w/g, (l) => l.toUpperCase()).replace(/ /g, '_');
}

export function msToTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Number(((milliseconds % 60000) / 1000).toFixed(0));
  return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
}

export function getAsset(
  context: ExtensionContext,
  name: string
): { light: string; dark: string } {
  const filename = `${name}.svg`;
  return {
    light: resolve(context.extensionPath, 'dist', 'assets', 'light', filename),
    dark: resolve(context.extensionPath, 'dist', 'assets', 'dark', filename),
  };
}

export function openInBrowser(url: string): void {
  try {
    open(url);
  } catch (error) {
    window.showErrorMessage(
      localize('circleci.couldntOpenUrl', `Couldn't open URL: {0}`, url)
    );
    console.error(error);
  }
}

export async function execCommand(cmd: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
      }

      resolve(stdout);
    });
  });
}

export function stripNewline(value: string): string {
  return value.replace(/\n|\r/g, '');
}

export async function downloadFile(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, function (response) {
        response.setEncoding('utf8');
        response.on('data', (data) => {
          resolve(data);
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

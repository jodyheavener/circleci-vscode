import { https } from 'follow-redirects';
import { join } from 'path';
import { window } from 'vscode';
const open = require('open');

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export function humanize(word: string) {
  return word.replace(/\b\w/g, (l) => l.toUpperCase()).replace(/ /g, '_');
}

export function msToTime(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Number(((milliseconds % 60000) / 1000).toFixed(0));
  return `${minutes}m ${(seconds < 10 ? '0' : '') + seconds}s`;
}

export function getAsset(filename: string): string {
  return join(__filename, '..', '..', '..', 'assets', filename);
}

export function openInBrowser(url: string) {
  try {
    open(url);
  } catch (error) {
    window.showErrorMessage(`Couldn't open URL: ${url}`);
    console.error(error.stack);
  }
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

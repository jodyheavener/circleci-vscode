import { workspace } from 'vscode';
import { ConfigItems } from './types';

let exportedConfig: Config;

export class Config {
  private changeCallback?: () => void;

  constructor() {
    workspace.onDidChangeConfiguration(() => {
      this.changeCallback && this.changeCallback();
    });
  }

  get(key: keyof ConfigItems): ConfigItems[typeof key] {
    const config = workspace.getConfiguration('circleci');
    return config[key] as ConfigItems[typeof key];
  }

  onChange(callback: () => void): void {
    this.changeCallback = callback;
  }
}

export default function config(): Config {
  if (!exportedConfig) {
    exportedConfig = new Config();
  }

  return exportedConfig;
}

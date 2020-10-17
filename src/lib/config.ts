import { ConfigurationTarget, workspace, WorkspaceConfiguration } from 'vscode';
import constants from './constants';
import { ConfigItems } from './types';

let exportedConfig: Config | null = null;

export class Config {
  private changeCallback?: () => void;
  private config: WorkspaceConfiguration;

  constructor() {
    this.config = workspace.getConfiguration(constants.EXTENSION_ID);

    workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(constants.EXTENSION_ID)) {
        this.changeCallback && this.changeCallback();
      }
    });
  }

  get(key: keyof ConfigItems): ConfigItems[typeof key] {
    return this.config.get<ConfigItems[typeof key]>(key)!;
  }

  set(key: keyof ConfigItems, value: ConfigItems[typeof key]): void {
    this.config.update(key, value);
  }

  onChange(callback: () => void): void {
    this.changeCallback = callback;
  }

  migrate(
    keySets: { [oldKey: string]: string },
    oldSectionString: string
  ): void {
    const oldSection = oldSectionString
      ? workspace.getConfiguration(oldSectionString)
      : this.config;

    Object.keys(keySets).forEach((oldKey) => {
      const newKey = keySets[oldKey];
      const oldValue = oldSection.get(oldKey);

      if (
        oldValue == null ||
        (typeof oldValue === 'string' && !oldValue) ||
        (Array.isArray(oldValue) && !oldValue.length)
      ) {
        return;
      }

      this.config.update(newKey, oldValue, ConfigurationTarget.Global);
    });
  }
}

export function reset(): void {
  exportedConfig = null;
}

export default function config(): Config {
  if (!exportedConfig) {
    exportedConfig = new Config();
  }

  return exportedConfig;
}

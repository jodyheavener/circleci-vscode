import { workspace } from 'vscode';
import { ConfigItems } from './types';

let exportedConfig: Config;

export class Config {
  readonly items: ConfigItems;
  private changeCallback?: () => void;

  constructor() {
    const {
      apiToken,
      customBranches,
      autoLoadWorkflows,
      autoLoadWorkflowJobs,
      VCSProvider,
    } = workspace.getConfiguration('circleci');

    this.items = {
      apiToken,
      customBranches,
      autoLoadWorkflows,
      autoLoadWorkflowJobs,
      VCSProvider,
    };

    workspace.onDidChangeConfiguration(() => {
      this.changeCallback && this.changeCallback();
    });
  }

  get(key: keyof ConfigItems): ConfigItems[typeof key] {
    return this.items[key];
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

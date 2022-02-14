import {
  ConfigurationChangeEvent,
  ConfigurationTarget,
  ExtensionContext,
  workspace,
} from 'vscode';
import { EXTENSION_ID } from './constants';
import { events } from './events';
import { ConfigItems, ConfigKey, Events } from './types';

export class Configuration {
  configure(context: ExtensionContext): void {
    context.subscriptions.push(
      workspace.onDidChangeConfiguration(
        configuration.onConfigurationChanged,
        configuration
      )
    );
  }

  private onConfigurationChanged(event: ConfigurationChangeEvent): void {
    Object.values(ConfigKey).forEach((key) => {
      if (event.affectsConfiguration(`${EXTENSION_ID}.${key}`)) {
        events.fire(Events.ConfigChange, { key, value: this.get(key) });
      }
    });
  }

  get<T extends ConfigItems[keyof ConfigItems]>(
    section: ConfigKey,
    defaultValue?: T
  ): T {
    return defaultValue
      ? workspace.getConfiguration(EXTENSION_ID).get<T>(section) || defaultValue
      : workspace.getConfiguration(EXTENSION_ID).get<T>(section)!;
  }

  set(
    section: string,
    value: any,
    target: ConfigurationTarget
  ): Thenable<void> {
    return workspace
      .getConfiguration(EXTENSION_ID)
      .update(section, value, target);
  }
}

export const configuration = new Configuration();

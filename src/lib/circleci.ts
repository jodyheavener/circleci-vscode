import { default as CircleClient } from 'circle-client';
import { configuration } from './config';
import { events } from './events';
import { opSettings } from './op-settings';
import { ConfigKey, Events as EventTypes } from './types';

class Client {
  private apiToken?: string;
  client: CircleClient;

  constructor() {
    events.on(EventTypes.ConfigChange, this.configure.bind(this));
    this.configure();
  }

  async configure(manual = false): Promise<void> {
    let newToken: string;

    const use1Password = configuration.get<boolean>(ConfigKey.Use1Password);
    if (use1Password && manual === true) {
      newToken = await opSettings.retrieve(ConfigKey.APIToken);

      if (!newToken) {
        events.fire(EventTypes.OPFailure);
      }
    } else {
      newToken = configuration.get<string>(ConfigKey.APIToken);
    }

    if (!newToken) {
      throw new Error("Couldn't find API token.");
    }

    if (newToken !== this.apiToken) {
      this.apiToken = newToken;
      this.client = new CircleClient(this.apiToken);
      events.fire(EventTypes.ClientUpdate);
    }
  }
}

export const circleci = new Client();
export const client = circleci.client;

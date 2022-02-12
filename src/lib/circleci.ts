import { default as CircleClient } from 'circle-client';
import { configuration } from './config';
import { events } from './events';
import { ConfigKey, Events as EventTypes } from './types';

class Client {
  private apiToken?: string;
  client: CircleClient;

  constructor() {
    events.on(EventTypes.ConfigChange, this.configure.bind(this));
    this.configure();
  }

  configure(): void {
    const newToken = configuration.get<string>(ConfigKey.APIToken);

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

export const client = new Client().client;

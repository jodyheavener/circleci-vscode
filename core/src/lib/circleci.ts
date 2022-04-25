import { default as CircleClient } from 'circle-client';
import { configuration } from './config';
import { events } from './events';
import { ConfigKey, Events as EventTypes } from './types';

class Client {
  private baseUrl?: string;
  private apiToken?: string;
  client: CircleClient;

  constructor() {
    events.on(EventTypes.ConfigChange, this.configure.bind(this));
    this.configure();
  }

  configure(): void {
    const newUrl = configuration.get<string>(ConfigKey.BaseUrl);
    const newToken = configuration.get<string>(ConfigKey.APIToken);

    if (!newUrl) {
      throw new Error("Couldn't find base API URL.");
    }

    if (!newToken) {
      throw new Error("Couldn't find API token.");
    }

    if (newUrl !== this.baseUrl || newToken !== this.apiToken) {
      this.baseUrl = newUrl;
      this.apiToken = newToken;
      console.log(this.apiToken, this.baseUrl);
      this.client = new CircleClient(this.apiToken, { baseUrl: this.baseUrl });
      events.fire(EventTypes.ClientUpdate);
    }
  }
}

export const client = new Client().client;

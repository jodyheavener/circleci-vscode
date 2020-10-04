import CircleCI from 'circle-client';
import { window } from 'vscode';
import config from './config';
import gitService from './git-service';
import { ConfigKey } from './types';
import { l } from './utils';

let exportedClient: CircleCI;

export default async function circleClient(): Promise<CircleCI> {
  const apiToken = config().get(ConfigKey.APIToken) as string;

  if (!exportedClient) {
    if (!apiToken) {
      window.showErrorMessage(
        l(
          'tokenRequired',
          'A CircleCI API token (`circleci.apiToken`) must be set.'
        )
      );
    }

    exportedClient = new CircleCI(
      apiToken,
      (await gitService()).circleProjectSlug
    );
  }

  return exportedClient;
}

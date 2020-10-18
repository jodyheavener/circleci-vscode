import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import constants from '../../../../lib/constants';
import { PostMessagePayload } from '../../../../lib/types';
import { l } from '../../lib/utils';
import CTAButton from '../CTAButton';
import Loading from '../Loading';
import CircleLogo from './circleci.svg';
import './index.scss';

const Welcome = ({ vscode }: { vscode: any }): JSX.Element => {
  let tokenField = useRef<HTMLInputElement | null>(null);
  const [setupInfo, setSetupInfo] = useState<{
    apiToken: string;
    configFile: string;
    version: string;
  } | null>(null);

  useEffect(() => {
    if (!setupInfo) {
      window.addEventListener(
        'message',
        ({ data }: { data: PostMessagePayload }) => {
          switch (data.event) {
            case constants.WELCOME_SETUP_WEBVIEW_EVENT:
              setSetupInfo({
                apiToken: data.data.apiToken,
                configFile: data.data.configFile,
                version: data.data.version,
              });
              break;
          }
        }
      );
    }
  }, [setupInfo]);

  if (!setupInfo) {
    return <Loading />;
  }

  return (
    <div>
      <header className="welcome-header">
        <CircleLogo />
        <div>
          <h1>Welcome to CircleCI for VS Code</h1>
          <p className="version">You’re on v{setupInfo.version}</p>
        </div>
      </header>

      <div>
        <p>
          To get started you’ll need to set a{' '}
          <a href="https://app.circleci.com/settings/user/tokens">
            Personal API Token
          </a>
          .
        </p>

        <form
          className="token-container"
          onSubmit={(event) => {
            event.preventDefault();

            vscode.postMessage({
              event: constants.UPDATE_TOKEN_WEBVIEW_EVENT,
              data: {
                token: tokenField.current?.value,
              },
            });
          }}
        >
          <input
            ref={tokenField}
            className="token-input"
            type="text"
            placeholder={l('tokenPlaceholder', 'API Token')}
            defaultValue={setupInfo.apiToken || ''}
          />
          <CTAButton text="Save" />
        </form>

        {setupInfo.configFile ? (
          <p>
            We found your CircleCI <code>{setupInfo.configFile}</code> file.
            You're all set!
          </p>
        ) : (
          <p>
            Once set, just add a project to your Workspace that has a
            <code>circleci.json</code> or <code>.circleci/config.json</code>{' '}
            file.
          </p>
        )}
      </div>

      <div>
        <p>
          For more information on how to get started, check out the the{' '}
          <a href="https://github.com/jodyheavener/circleci-vscode#circleci-for-vs-code">
            full documentation
          </a>
          . I’d love your feedback! You can{' '}
          <a href="https://github.com/jodyheavener/circleci-vscode/issues">
            file an issue
          </a>{' '}
          if you have questions or run in to any problems along the way. Thanks
          for installing!
        </p>
      </div>
    </div>
  );
};

export default Welcome;

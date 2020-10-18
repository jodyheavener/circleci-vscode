import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import constants from '../../../../lib/constants';
import { PostMessagePayload } from '../../../../lib/types';
import Loading from '../Loading';
import CircleLogo from './circleci.svg';
import './index.scss';

const Upgrade = ({}: { vscode: any }): JSX.Element => {
  const [changelog, setChangelog] = useState<{
    content: string;
    version: string;
  } | null>(null);

  useEffect(() => {
    if (!changelog) {
      window.addEventListener(
        'message',
        ({ data }: { data: PostMessagePayload }) => {
          switch (data.event) {
            case constants.CHANGELOG_CONTENT_WEBVIEW_EVENT:
              setChangelog({
                content: data.data.content,
                version: data.data.version,
              });
              break;
          }
        }
      );
    }
  }, [changelog]);

  if (!changelog) {
    return <Loading />;
  }

  return (
    <div>
      <header className="upgrade-header">
        <CircleLogo />
        <div>
          <h1>CircleCI for VS Code updated!</h1>
          <p className="version">You’re now on v{changelog.version}</p>
        </div>
      </header>

      <div>
        <h2>Here's what's new in this version:</h2>
        <div className="upgrade-changelog">
          {<ReactMarkdown source={changelog.content} />}
        </div>
      </div>
    </div>
  );
};

export default Upgrade;

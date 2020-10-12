import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import constants from '../../../../lib/constants';
import { PostMessagePayload } from '../../../../lib/types';
import Loading from '../Loading';
import './index.scss';

const Upgrade = ({ vscode }: { vscode: any }): JSX.Element => {
  const [initLoaded, setInitLoaded] = useState<boolean>(false);
  const [changelog, setChangelog] = useState<{ content: string; version: string; } | null>(null);

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
              setInitLoaded(true);
              break;
          }
        }
      );
    }
	}, [changelog]);

	if (!initLoaded) {
		return <Loading />
  }

  return (
		<div>
      <h1>New in CircleCI for VS Code v{changelog!.version}</h1>
      <div>
        {<ReactMarkdown source={changelog!.content} />}
      </div>
    </div>
  );
};

export default Upgrade;

import { JobTest } from 'circle-client';
import React, { ReactNodeArray } from 'react';
import reactStringReplace from 'react-string-replace';
import { l } from '../../lib/utils';
import constants from '../../../../lib/constants';
import StopwatchIcon from './stopwatch.svg';
import StatusSuccess from './status-check.svg';
import StatusFailed from './status-exclaim.svg';
import './index.scss';

const FILE_PATH_REGEX = /\/home\/circleci\/project\/(?!node_modules)([!\w\/\.]*(?:\:\d*)?(?:\:\d*)?)/g;

function linkFilePaths(value: string, vscode: any): ReactNodeArray {
  return reactStringReplace(value, FILE_PATH_REGEX, (match, i) => {
    const [path, line, character] = match.split(':');

    return (
      <>
        /home/circleci/project/
        <a
          key={i}
          className="open-file-link"
          onClick={() => {
            vscode.postMessage({
              event: constants.OPEN_FILE_WEBVIEW_EVENT,
              data: {
                path,
                line: parseInt(line) - 1,
                character: parseInt(character) - 1,
              },
            });
          }}
        >
          {match}
        </a>
      </>
    );
  });
}

const TestResult = ({
  test,
  vscode,
}: {
  test: JobTest;
  vscode: any;
}): JSX.Element => {
  return (
    <div className="test-result">
      <p className="test-classname">
        <span>
          {test.source !== 'unknown' ? `${test.source} • ` : ''}
          {test.classname}
        </span>

        <span className="test-duration">
          <StopwatchIcon />
          {l('testTimeSeconds', '{0}s', test.run_time)}
        </span>
      </p>

      <p className="test-name">
        {test.result === 'success' && <StatusSuccess />}
        {test.result === 'failure' && <StatusFailed />}

        {test.name}
      </p>

      {test.result === 'failure' && test.message && (
        <details className="test-message">
          <summary>{l('detailsTitle', 'See Details...')}</summary>
          <div className="test-message-content">
            {test.message.split('\n').map((text, index) => (
              <React.Fragment key={`${text}-${index}`}>
                {linkFilePaths(text, vscode)}
                <br />
              </React.Fragment>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default TestResult;

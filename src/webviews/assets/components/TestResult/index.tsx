import { JobTest } from 'circle-client';
import React from 'react';
import StopwatchIcon from './stopwatch.svg';
import StatusSuccess from './status-check.svg';
import StatusFailed from './status-exclaim.svg';
import { l } from '../../lib/utils';
import './index.scss';

const TestResult = ({ test }: { test: JobTest }): JSX.Element => {
  if (test.result === 'failure') {
    console.log(test);
  }

  return (
    <div className="test-result">
      <p className="test-classname">
        <span>
          {test.source !== 'unknown' ? `${test.source} • ` : ''}
          {test.classname}
        </span>

        {test.result === 'success' && (
          <span className="test-duration">
            <StopwatchIcon />
            {l('testTimeSeconds', '{0}s', test.run_time)}
          </span>
        )}
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
                {text}
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

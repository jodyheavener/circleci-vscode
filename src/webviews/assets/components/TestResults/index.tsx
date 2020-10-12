import React from 'react';
import { JobTest } from 'circle-client';
import constants from '../../../../lib/constants';
import { l } from '../../lib/utils';
import NoTests from '../NoTests';
import TestResult from '../TestResult';
import './index.scss';
import CTAButton from '../CTAButton';

const TestResults = ({
  vscode,
  query,
  setQuery,
  tests,
  hasMore,
  loaded,
  hasTests,
}: {
  vscode: any;
  query: string | null;
  setQuery: (value: React.SetStateAction<string | null>) => void;
  tests: JobTest[];
  hasMore: boolean;
  loaded: boolean;
  hasTests: boolean;
}): JSX.Element => {
  if (!loaded) {
    return <p>{l('loadingLabel', 'Loading...')}</p>;
  }

  if (!hasTests) {
    return (
      <div className="results-container">
        <NoTests />
      </div>
    );
  }

  return (
    <div className="results-container">
      {query && (
        <p>
          {l('searchQueryLabel', 'Search query:')}{' '}
          <span className="query-text">{query}</span> •{' '}
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setQuery(null);
            }}
          >
            {l('searchQueryClear', 'Clear results')}
          </a>
        </p>
      )}

      <div>
        {tests.length ? (
          tests.map((test: JobTest, index: number) => (
            <TestResult key={index} {...{ test }} />
          ))
        ) : (
          <p className="no-results">
            {l('noSearchResults', 'Sorry, no results.')}
          </p>
        )}
      </div>

      {!query && hasMore && (
        <div className="load-more-container">
          <CTAButton
            text={l('loadTests', 'Load more')}
            onClick={() => {
              vscode.postMessage({
                event: constants.REQUEST_TESTS_WEBVIEW_EVENT,
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TestResults;

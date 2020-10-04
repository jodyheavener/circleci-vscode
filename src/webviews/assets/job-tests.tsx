import { JobTest } from 'circle-client';
import React, { useCallback, useEffect, useState } from 'react';
import { render } from 'react-dom';
import constants from '../../lib/constants';
import { l } from '../../lib/localize';
import { PostMessagePayload } from '../../lib/types';
import './job-tests.scss';

// @ts-ignore
const vscode = acquireVsCodeApi();
const mountElement = document.getElementById('root')!;
const vsTheme = document.body.dataset.vscodeThemeKind!.split('-')[1];
const rootPath = mountElement.dataset.rootPath;

const JobTests = (): JSX.Element => {
  const [job, setJob] = useState<{ name: string; number: number } | null>(null);
  const [tests, setTests] = useState<JobTest[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [query, setQuery] = useState<string | null>(null);

  useEffect(() => {
    if (!job) {
      window.addEventListener(
        'message',
        ({ data }: { data: PostMessagePayload }) => {
          switch (data.event) {
            case constants.TEST_DATA_WEBVIEW_EVENT:
              setTests((existing) => existing.concat(data.data.tests));
              setHasMore(data.data.hasMore);
              break;
            case constants.JOB_DATA_WEBVIEW_EVENT:
              setJob({
                name: data.data.name,
                number: data.data.number,
              });
              break;
          }
        }
      );

      vscode.postMessage({
        event: constants.REQUEST_JOB_WEBVIEW_EVENT,
      });
    }
  }, [job]);

  let filteredTests = tests;
  if (query) {
    // filter anything test-related against the query
    filteredTests = tests.filter((test) =>
      Object.values(test).some(
        (value) => typeof value === 'string' && value.includes(query)
      )
    );
  }

  return !job ? (
    <p>Loading...</p>
  ) : (
    <>
      <Header name={job.name} number={job.number} {...{ query, setQuery }} />
      <div className="tests">
        {filteredTests.length ? (
          <Tests tests={filteredTests} {...{ query }} />
        ) : (
          <p className="no-tests">
            <img
              src={`${rootPath}/assets/${vsTheme}/none.svg`}
              alt="No tests"
            />
            {query
              ? l('noQueryResults', 'No matches for the query "{0}"', query)
              : l('noJobTests', 'This Job has no Tests')}
          </p>
        )}
        {hasMore && <LoadMore />}
      </div>
    </>
  );
};

const Header = ({
  name,
  number,
  query,
  setQuery,
}: {
  name: string;
  number: number;
  query: string | null;
  setQuery: (value: React.SetStateAction<string | null>) => void;
}): JSX.Element => {
  let typeTimer: NodeJS.Timeout | null;

  const onSearch = useCallback((value: string) => {
    clearTimeout(typeTimer!);
    // @ts-ignore
    typeTimer = setTimeout(() => {
      setQuery(value);
    }, 500);
  }, []);

  const onClear = useCallback(() => {
    setQuery(null);
    typeTimer = null;
  }, []);

  return (
    <header className="main-header">
      <div>
        <h1>{l('jobTestsTitle', 'Job {0} tests', number)}</h1>
        <p className="name">
          <img
            src={`${rootPath}/assets/${vsTheme}/workflow.svg`}
            alt="Workflow icon"
          />
          {name}
        </p>
      </div>

      <div className="header-right">
        <form>
          <input
            className={`search-input ${query ? 'has-query' : ''}`}
            type="text"
            placeholder={l('searchTestsPlaceholder', 'Search tests')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onSearch(event.target.value);
            }}
          />

          {query && (
            <button onClick={onClear} className="search-clear">
              <img
                src={`${rootPath}/assets/${vsTheme}/ex.svg`}
                alt="Clear icon"
              />
            </button>
          )}
        </form>
      </div>
    </header>
  );
};

const Tests = ({
  query,
  tests,
}: {
  query: string | null;
  tests: JobTest[];
}): JSX.Element => (
  <div className="tests">
    {query && <p>Query: {query}</p>}
    {tests.map((test: JobTest, index: number) => (
      <Test key={index} {...{ test }} />
    ))}
  </div>
);

const statusIcons: { [key: string]: string } = {
  success: 'status-check',
  failed: 'status-exclaim',
};

const Test = ({ test }: { test: JobTest }): JSX.Element => (
  <div className="test-row">
    <p className="test-classname">{test.classname}</p>
    <p className="test-name">
      <img
        src={`${rootPath}/assets/${vsTheme}/${statusIcons[test.result]}.svg`}
        alt={`Test status: ${test.result}`}
      />
      {test.name}
    </p>
  </div>
);

const LoadMore = (): JSX.Element => {
  const onClick = useCallback(() => {
    vscode.postMessage({
      event: constants.REQUEST_TESTS_WEBVIEW_EVENT,
    });
  }, []);

  return (
    <button className="load-more" {...{ onClick }}>
      {l('loadTests', 'Load more')}
    </button>
  );
};

render(
  <React.StrictMode>
    <JobTests />
  </React.StrictMode>,
  mountElement
);

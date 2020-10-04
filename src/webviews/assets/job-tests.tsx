import { JobTest } from 'circle-client';
import * as nls from 'vscode-nls';
import React, { useCallback, useEffect, useState } from 'react';
import { render } from 'react-dom';
import constants from '../../lib/constants';
import { PostMessagePayload } from '../../lib/types';
import './job-tests.scss';

export function l(
  key: string | nls.LocalizeInfo,
  message: string,
  ...args: (string | number | boolean | undefined | null)[]
): string {
  if (typeof key === 'string') {
    return nls.config()()(
      `${constants.LOCALIZATION_PREFIX}.${key}`,
      message,
      ...args
    );
  } else {
    return nls.config()()(key, message, ...args);
  }
}

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
      <Tests tests={filteredTests} {...{ query }} />
      {hasMore && <LoadMore />}
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
    <header>
      <div>
        <h1>Job {number} tests</h1>
        <p>
          <img
            src={`${rootPath}/assets/${vsTheme}/workflow.svg`}
            alt="Workflow icon"
          />
          {name}
        </p>
      </div>

      <div>
        <form>
          <input
            type="text"
            placeholder={l('searchTestsPlaceholder', 'Search tests')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onSearch(event.target.value);
            }}
          />

          {query && (
            <button onClick={onClear}>
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
  <>
    {query && <p>Query: {query}</p>}
    {tests.map((test: JobTest, index: number) => (
      <Test key={index} {...{ test }} />
    ))}
  </>
);

const statusIcons: { [key: string]: string } = {
  success: 'status-check',
  failed: 'status-exclaim',
};

const Test = ({ test }: { test: JobTest }): JSX.Element => (
  <div>
    <p>{test.classname}</p>
    <p>
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

  return <button {...{ onClick }}></button>;
};

render(
  <React.StrictMode>
    <JobTests />
  </React.StrictMode>,
  mountElement
);

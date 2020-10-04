import { JobTest } from 'circle-client';
import React, { useCallback, useEffect, useState } from 'react';
import { render } from 'react-dom';
import constants from '../../lib/constants';
import { PostMessagePayload } from '../../lib/types';
import './job-tests.scss';
import { interpolate, l } from './utils';

type JobDetails = {
  jobName: string;
  jobNumber: number;
  pipelineNumber: number;
  workflowId: string;
  vcs: string;
  user: string;
  repo: string;
};

// @ts-ignore
const vscode = acquireVsCodeApi();
const mountElement = document.getElementById('root')!;
const vsTheme = document.body.dataset.vscodeThemeKind!.split('-')[1];
const rootPath = mountElement.dataset.rootPath;

function getJobUrl(jobDetails: JobDetails): string {
  return interpolate(constants.JOB_URL, {
    vcs: jobDetails.vcs,
    user: jobDetails.user,
    repo: jobDetails.repo,
    pipeline_number: jobDetails.pipelineNumber,
    workflow_id: jobDetails.workflowId,
    job_number: jobDetails.jobNumber,
  });
}

const JobTests = (): JSX.Element => {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [tests, setTests] = useState<JobTest[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [query, setQuery] = useState<string | null>(null);

  useEffect(() => {
    if (!jobDetails) {
      window.addEventListener(
        'message',
        ({ data }: { data: PostMessagePayload }) => {
          switch (data.event) {
            case constants.TEST_DATA_WEBVIEW_EVENT:
              setTests((existing) => existing.concat(data.data.tests));
              setHasMore(data.data.hasMore);
              break;
            case constants.JOB_DATA_WEBVIEW_EVENT:
              setJobDetails(data.data as JobDetails);
              break;
          }
        }
      );

      vscode.postMessage({
        event: constants.REQUEST_JOB_WEBVIEW_EVENT,
      });
    }
  }, [jobDetails]);

  let filteredTests = tests;
  if (query) {
    // filter anything test-related against the query
    filteredTests = tests.filter((test) =>
      Object.values(test).some(
        (value) => typeof value === 'string' && value.includes(query)
      )
    );
  }

  return !jobDetails ? (
    <p>Loading...</p>
  ) : (
    <>
      <Header {...{ jobDetails, query, setQuery }} />
      <div className="tests">
        {filteredTests.length ? (
          <Tests tests={filteredTests} {...{ query }} />
        ) : (
          <p className="no-tests">
            <img
              src={`${rootPath}/assets/${vsTheme}/none.svg`}
              alt="No tests"
            />
            {query && (
              <>
                {l('noQueryResults', 'No matches for the query')}:{' '}
                <span className="query-text">{query}</span>
              </>
            )}

            {!query && (
              <>
                {l(
                  'noJobTestsExplanation',
                  `We couldn't find any Test metadata for this Job. The Job details page may have additional output.`
                )}{' '}
                <a href={getJobUrl(jobDetails)}>
                  {l('openJobPage', 'Open Job in browser')}
                </a>
              </>
            )}
          </p>
        )}
        {hasMore && <LoadMore />}
      </div>
    </>
  );
};

const Header = ({
  jobDetails,
  query,
  setQuery,
}: {
  jobDetails: JobDetails;
  query: string | null;
  setQuery: (value: React.SetStateAction<string | null>) => void;
}): JSX.Element => {
  let typeTimer: NodeJS.Timeout | null;

  const onSearch = useCallback((value: string) => {
    clearTimeout(typeTimer!);
    // @ts-ignore
    typeTimer = setTimeout(() => {
      setQuery(value);
    }, 300);
  }, []);

  const onClear = useCallback(() => {
    setQuery(null);
    typeTimer = null;
  }, []);

  return (
    <header className="main-header">
      <div>
        <h1>{l('jobTestsTitle', 'Job {0} tests', jobDetails.jobNumber)}</h1>
        <p className="name">
          <img
            src={`${rootPath}/assets/${vsTheme}/workflow.svg`}
            alt="Workflow icon"
          />
          {jobDetails.jobName}
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
    {query && (
      <p>
        Search query: <span className="query-text">{query}</span>
      </p>
    )}
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
    <p className="test-classname">
      <span>{test.classname}</span>
      <span className="test-duration">
        <img
          src={`${rootPath}/assets/${vsTheme}/stopwatch.svg`}
          alt={test.run_time}
        />
        {l('testTimeSeconds', '{0}s', test.run_time)}
      </span>
    </p>
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
    <button className="cta-button" {...{ onClick }}>
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

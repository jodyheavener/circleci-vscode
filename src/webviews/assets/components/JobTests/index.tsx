import React, { useEffect, useState } from 'react';
import { JobTest } from 'circle-client';
import constants from '../../../../lib/constants';
import { JobTestDetails, PostMessagePayload } from '../../../../lib/types';
import TestsHeader from '../TestsHeader';
import TestResults from '../TestResults';
import Loading from '../Loading';
import './index.scss';

const JobTests = ({ vscode }: { vscode: any }): JSX.Element => {
  const [jobDetails, setJobDetails] = useState<JobTestDetails | null>(null);
  const [initLoaded, setInitLoaded] = useState<boolean>(false);
  const [initHasTests, setInitHasTests] = useState<boolean>(false);
  const [tests, setTests] = useState<JobTest[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [query, setQuery] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'status' | 'alphabetically' | 'duration'>('status');

  useEffect(() => {
    if (!jobDetails) {
      window.addEventListener(
        'message',
        ({ data }: { data: PostMessagePayload }) => {
          switch (data.event) {
            case constants.TEST_DATA_WEBVIEW_EVENT:
              if (!initLoaded) {
                setInitLoaded(true);
                setInitHasTests(!!(data.data.tests.length));
              }

              setTests((existing) => existing.concat(data.data.tests));
              setHasMore(data.data.hasMore);
              break;
            case constants.JOB_DATA_WEBVIEW_EVENT:
              setJobDetails(data.data as JobTestDetails);
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

  if (sortBy === 'status') {
    filteredTests.sort((a, b) => a.result.localeCompare(b.result))
  }

  if (sortBy === 'alphabetically') {
    filteredTests.sort((a, b) => a.classname.localeCompare(b.classname))
  }

  if (sortBy === 'duration') {
    filteredTests.sort((a, b) => { return b.run_time - a.run_time })
  }

  if (!jobDetails) {
    return <Loading />;
  }

  return (
    <>
      <TestsHeader {...{ jobDetails, query, setQuery, hasTests: initHasTests, sortBy, setSortBy }} />
      <TestResults {...{ vscode, query, setQuery, tests: filteredTests, hasMore, loaded: initLoaded, hasTests: initHasTests } }/>
    </>
  );
};

export default JobTests;

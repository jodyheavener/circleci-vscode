import React from 'react';
import { JobTestDetails } from '../../../../lib/types';
import { getJobUrl, l } from '../../lib/utils';
import Search from '../Search';
import CTAButton from '../CTAButton';
import JobIcon from './job.svg';
import './index.scss';

const TestsHeader = ({
  jobDetails,
  query,
  setQuery,
  hasTests,
  sortBy,
  setSortBy,
}: {
  jobDetails: JobTestDetails;
  query: string | null;
  setQuery: (value: React.SetStateAction<string | null>) => void;
  hasTests: boolean;
  sortBy: 'status' | 'alphabetically' | 'duration';
  setSortBy: (
    value: React.SetStateAction<'status' | 'alphabetically' | 'duration'>
  ) => void;
}): JSX.Element => {
  return (
    <div className="header-container">
      <header className="header">
        <div>
          <h1>{l('jobTestsTitle', 'Job {0} tests', jobDetails.jobNumber)}</h1>
          <p className="job-name">
            <JobIcon className="job-icon" />
            {jobDetails.jobName}
          </p>
        </div>

        <div className="header-right">
          <CTAButton
            text={l('openJob', 'Open in browser')}
            href={getJobUrl(jobDetails)}
          />
        </div>
      </header>

      {hasTests && (
        <div className="filters">
          <Search {...{ query, setQuery }} />

          <p className="sorts">
            {l('sortBy', 'Sort:')}{' '}
            <a
              href="#"
              className={sortBy === 'status' ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault();
                setSortBy('status');
              }}
            >
              {l('sortByStatus', 'Status')}
            </a>
            <a
              href="#"
              className={sortBy === 'alphabetically' ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault();
                setSortBy('alphabetically');
              }}
            >
              {l('sortByAlphabetically', 'Alphabetically')}
            </a>
            <a
              href="#"
              className={sortBy === 'duration' ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault();
                setSortBy('duration');
              }}
            >
              {l('sortByDuration', 'Duration')}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default TestsHeader;

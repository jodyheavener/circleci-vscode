import React from "react";
import { URLS } from "../../lib/constants";
import { useJobData } from "../../lib/job-data";
import { interpolate } from "../../lib/utils";
import Button from "../Button";
import styles from "./index.module.css";
import { ReactComponent as JobIcon } from "./job.svg";

const Header = (): JSX.Element => {
  const { name, vcs, user, repo, pipeline_number, workflow_id, job_number } =
    useJobData();

  return (
    <div className={styles.outer}>
      <header className={styles.inner}>
        <div>
          <h1>#{job_number} tests</h1>
          <p className={styles.name}>
            <JobIcon className="job-icon" />
            {name}
          </p>
        </div>

        <div>
          <Button
            href={`${interpolate(URLS.JOB_URL, {
              vcs,
              user,
              repo,
              pipeline_number,
              workflow_id,
              job_number,
            })}/tests`}
          >
            Open in browser
          </Button>
        </div>
      </header>
    </div>
  );
};

export default Header;

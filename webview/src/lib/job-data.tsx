import React, { useContext, useEffect, useState } from "react";
import { WEBVIEW_EVENTS } from "./constants";
import { JobData } from "./types";
import { postMessage } from "./utils";

const defaultData: JobData = {
  ready: false,
  name: "Unknown",
  vcs: "github",
  user: "Unknown",
  repo: "Unknown",
  pipeline_number: 0,
  workflow_id: "Unknown",
  job_number: 0,
  tests: [],
};

const JobDataContext = React.createContext<JobData>(defaultData);

export const JobDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [jobData, setJobData] = useState<JobData>(defaultData);

  useEffect(() => {
    const listener = (event: MessageEvent<any>) => {
      const { type, data } = event.data;
      switch (type) {
        case WEBVIEW_EVENTS.JOB_DATA:
          setJobData(data);
          break;
      }
    };

    window.addEventListener("message", listener);
    postMessage(WEBVIEW_EVENTS.WEBVIEW_READY);
    return () => window.removeEventListener("message", listener);
  }, []);

  return (
    <JobDataContext.Provider value={jobData}>
      {children}
    </JobDataContext.Provider>
  );
};

export const useJobData = () => useContext(JobDataContext);

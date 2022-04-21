import React from "react";
import { useFilters } from "../../lib/filters";
import { useJobData } from "../../lib/job-data";
import Result from "../Result";
import styles from "./index.module.css";

const Results = (): JSX.Element => {
  const { tests } = useJobData();
  const { query, sortKey } = useFilters();

  let filteredTests = [...tests];

  if (query.length > 0) {
    filteredTests = tests.filter((test) =>
      Object.values(test).some(
        (value) => typeof value === "string" && value.includes(query)
      )
    );
  }

  switch (sortKey) {
    case "status":
      filteredTests.sort((a, b) => a.result.localeCompare(b.result));
      break;
    case "alphabetically":
      filteredTests.sort((a, b) => a.classname.localeCompare(b.classname));
      break;
    case "duration":
      filteredTests.sort((a, b) => b.run_time - a.run_time);
      break;
  }

  return (
    <div className={styles.container}>
      {query.length > 0 && (
        <p className={styles.currentQuery}>
          Search query:
          <code>{query}</code>
        </p>
      )}

      <div>
        {filteredTests.map((test, index) => (
          <Result key={index} {...{ test }} />
        ))}
      </div>
    </div>
  );
};

export default Results;

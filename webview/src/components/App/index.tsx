import React from "react";
import { useJobData } from "../../lib/job-data";
import Filters from "../Filters";
import Header from "../Header";
import Loading from "../Loading";
import NoResults from "../NoResults";
import Results from "../Results";
import styles from "./index.module.css";

const App = (): JSX.Element => {
  const { ready, tests } = useJobData();

  if (!ready) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Header />
      {tests.length > 0 ? (
        <>
          <Filters />
          <Results />
        </>
      ) : (
        <NoResults />
      )}
    </div>
  );
};

export default App;

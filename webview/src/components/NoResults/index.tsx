import React from "react";
import Button from "../Button";
import styles from "./index.module.css";

const NoResults = (): JSX.Element => (
  <div className={styles.container}>
    <div>
      <h3>This job doesn't have any test metadata.</h3>
      <p>
        You can set up test metadata collection by setting the{" "}
        <code>store_test_results</code> key in your config.
      </p>
      <p>
        <Button href="https://circleci.com/docs/2.0/collect-test-data/">
          Learn more
        </Button>
      </p>
    </div>
  </div>
);

export default NoResults;

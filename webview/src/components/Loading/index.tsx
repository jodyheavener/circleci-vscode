import React from "react";
import styles from "./index.module.css";
import { ReactComponent as CircleLogo } from "./logo.svg";

const Loading = (): JSX.Element => (
  <div className={styles.container}>
    <CircleLogo className={styles.icon} />
    <p className={styles.label}>Loading...</p>
  </div>
);

export default Loading;

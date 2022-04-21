import clsx from "clsx";
import React from "react";
import { useThemeObserver } from "../../lib/theme-observer";
import Search from "../Search";
import SortToggle from "../SortToggle";
import styles from "./index.module.css";

const Filters = (): JSX.Element => {
  const theme = useThemeObserver();

  return (
    <div className={clsx(styles.outer, theme === "dark" && styles.darkBg)}>
      <div className={styles.inner}>
        <Search />

        <div>
          <span className={styles.sortLabel}>Sort:</span>
          <SortToggle sortKey="status" label="Status" />
          <SortToggle sortKey="alphabetically" label="Alphabetically" />
          <SortToggle sortKey="duration" label="Duration" />
        </div>
      </div>
    </div>
  );
};

export default Filters;

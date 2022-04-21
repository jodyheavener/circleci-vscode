import clsx from "clsx";
import React from "react";
import { SortKey, useFilters } from "../../lib/filters";
import styles from "./index.module.css";

const SortToggle = ({
  label,
  sortKey,
}: {
  label: string;
  sortKey: SortKey;
}): JSX.Element => {
  const { sortKey: activeKey, setSortKey } = useFilters();
  return (
    <button
      className={clsx(styles.toggle, sortKey === activeKey && styles.active)}
      onClick={() => setSortKey(sortKey)}
    >
      {label}
    </button>
  );
};

export default SortToggle;

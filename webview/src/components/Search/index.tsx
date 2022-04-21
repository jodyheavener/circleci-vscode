import clsx from "clsx";
import React, { useCallback, useRef } from "react";
import { useFilters } from "../../lib/filters";
import { ReactComponent as ExIcon } from "./ex.svg";
import styles from "./index.module.css";

const Search = (): JSX.Element => {
  const { query, setQuery } = useFilters();
  const hasQuery = query.length > 0;
  let typeTimer = useRef<NodeJS.Timeout | null>(null);
  let searchField = useRef<HTMLInputElement | null>(null);

  const onSearch = useCallback(
    (value: string) => {
      clearTimeout(typeTimer.current!);
      typeTimer.current = setTimeout(() => setQuery(value), 100);
    },
    [setQuery]
  );

  const onClear = useCallback(() => {
    setQuery("");
    searchField.current!.value = "";
    clearTimeout(typeTimer.current!);
  }, [setQuery]);

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <input
        ref={searchField}
        className={clsx(styles.field, hasQuery && styles.hasQuery)}
        type="text"
        placeholder="Search tests"
        defaultValue={query}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onSearch(event.target.value);
        }}
      />

      {hasQuery && (
        <button type="button" onClick={onClear} className={styles.clear}>
          <ExIcon />
        </button>
      )}
    </form>
  );
};

export default Search;

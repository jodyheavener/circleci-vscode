import React, { useCallback, useRef } from 'react';
import { l } from '../../lib/utils';
import ExIcon from './ex.svg';
import './index.scss';

const Search = ({
  query,
  setQuery,
}: {
  query: string | null;
  setQuery: (value: React.SetStateAction<string | null>) => void;
}): JSX.Element => {
  let typeTimer: NodeJS.Timeout | null;
  let searchField = useRef<HTMLInputElement | null>(null);

  const onSearch = useCallback(
    (value: string) => {
      clearTimeout(typeTimer!);
      // @ts-ignore
      typeTimer = setTimeout(() => {
        setQuery(value);
      }, 300);
    },
    [query]
  );

  const onClear = useCallback(() => {
    setQuery(null);
    typeTimer = null;
  }, [query]);

  return (
    <form
      className="search-form"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <input
        ref={searchField}
        className={`search-input ${query ? 'has-query' : ''}`}
        type="text"
        placeholder={l('searchTestsPlaceholder', 'Search tests')}
        defaultValue={query ? query : ''}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onSearch(event.target.value);
        }}
      />

      {query && (
        <button type="button" onClick={onClear} className="search-clear">
          <ExIcon />
        </button>
      )}
    </form>
  );
};

export default Search;

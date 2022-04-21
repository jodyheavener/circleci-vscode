import React, { useContext, useState } from "react";

export type SortKey = "status" | "duration" | "alphabetically";

const defaultValue = {
  query: "",
  setQuery: () => {},
  sortKey: "status" as SortKey,
  setSortKey: () => {},
};

const FiltersContext = React.createContext<{
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  sortKey: SortKey;
  setSortKey: React.Dispatch<React.SetStateAction<SortKey>>;
}>(defaultValue);

export const FiltersContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [query, setQuery] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("status");

  return (
    <FiltersContext.Provider
      value={{
        query,
        setQuery,
        sortKey,
        setSortKey,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);

import React, { useState } from "react";
import styles from "./Search.module.scss";

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      className={styles.searchInput}
      value={query}
      onChange={handleChange}
      placeholder="Search Users"
    />
  );
};

export default Search;

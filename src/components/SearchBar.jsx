import React from 'react';

function SearchBar({ query, type, onQueryChange, onTypeChange, onSearch, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, type);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-box">
        <input
          type="text"
          placeholder="Search papers, authors, or topics"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          disabled={loading}
          aria-label="Search query"
        />
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          disabled={loading}
          aria-label="Result type"
        >
          <option value="all">All</option>
          <option value="author">Authors</option>
          <option value="paper">Papers</option>
          <option value="topic">Topics</option>
        </select>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;

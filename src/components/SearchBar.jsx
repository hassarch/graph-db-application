import React, { useState } from 'react';

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, type);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-box">
        <input
          type="text"
          placeholder="Search for papers, authors, or topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} disabled={loading}>
          <option value="all">All</option>
          <option value="author">Authors</option>
          <option value="paper">Papers</option>
          <option value="topic">Topics</option>
        </select>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;

import React from 'react';

function SearchResults({ results, onSelect, loading, hasSearched }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span className="loading-text">Searching the graph…</span>
      </div>
    );
  }

  const items = Array.isArray(results) ? results : [];

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h3>{hasSearched ? 'No results found' : 'Start exploring'}</h3>
        <p>
          Try searching for authors like <strong>"Sarah Chen"</strong> or topics like{' '}
          <strong>"Machine Learning"</strong>.
        </p>
      </div>
    );
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'author': return 'Author';
      case 'paper': return 'Paper';
      case 'topic': return 'Topic';
      default: return type;
    }
  };

  const getBadgeClass = (type) =>
    type === 'author' ? 'primary' : type === 'paper' ? 'secondary' : 'success';

  return (
    <div className="grid grid-2">
      {items.map((result, index) => (
        <button
          type="button"
          key={`${result.type}-${result.id ?? result.name}-${index}`}
          className="card card--interactive"
          onClick={() => onSelect(result)}
        >
          <div className="card-title">
            {result.name}
          </div>
          <div className="card-subtitle">
            <span className={`badge badge-${getBadgeClass(result.type)}`}>{result.type}</span>
            {result.metric != null && (
              <span className="metric">
                {result.type === 'author' ? `h-index: ${result.metric}` : `Year: ${result.metric}`}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export default SearchResults;

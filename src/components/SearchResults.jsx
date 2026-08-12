import React from 'react';

function SearchResults({ results, onSelect, loading }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="empty-state">
        <h3>No results</h3>
        <p>Try searching for authors like "Sarah Chen" or topics like "Machine Learning"</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'author': return '👤';
      case 'paper': return '📄';
      case 'topic': return '🏷️';
      default: return '•';
    }
  };

  return (
    <div className="grid grid-2">
      {results.map((result, index) => (
        <div
          key={index}
          className="card"
          onClick={() => onSelect(result)}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-title">
            {getIcon(result.type)} {result.name}
          </div>
          <div className="card-subtitle">
            <span className={`badge badge-${result.type === 'author' ? 'primary' : result.type === 'paper' ? 'secondary' : 'success'}`}>
              {result.type}
            </span>
            {result.metric && (
              <span className="metric">
                {result.type === 'author' ? `h-index: ${result.metric}` : `Year: ${result.metric}`}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;

import React, { useState } from 'react';

function CollaborationPath() {
  const [fromAuthor, setFromAuthor] = useState('');
  const [toAuthor, setToAuthor] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const findPath = async (e) => {
    e.preventDefault();
    
    if (!fromAuthor.trim() || !toAuthor.trim()) {
      setError('Please enter both author names');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/collaboration-path?from=${encodeURIComponent(fromAuthor)}&to=${encodeURIComponent(toAuthor)}`
      );
      if (!response.ok) throw new Error('Failed to find path');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2 className="card-title">🕸️ Find Collaboration Path</h2>
        <p className="card-subtitle">
          Discover how two researchers are connected through co-authorships
        </p>
        
        <form onSubmit={findPath} style={{ marginTop: '1rem' }}>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="From Author (e.g., Dr. Sarah Chen)"
              value={fromAuthor}
              onChange={(e) => setFromAuthor(e.target.value)}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                color: 'var(--text)',
                fontSize: '1rem'
              }}
            />
            <input
              type="text"
              placeholder="To Author (e.g., Prof. David Kim)"
              value={toAuthor}
              onChange={(e) => setToAuthor(e.target.value)}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                color: 'var(--text)',
                fontSize: '1rem'
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Find Path'}
          </button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      {result && !result.found && (
        <div className="card">
          <p style={{ color: 'var(--text-secondary)' }}>
            No collaboration path found between these authors.
          </p>
        </div>
      )}

      {result && result.found && (
        <div className="section">
          <h3 className="section-title">Path Found! ({result.hops} hops)</h3>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {result.authors.map((author, index) => (
                <React.Fragment key={index}>
                  <span className="badge badge-primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                    {author}
                  </span>
                  {index < result.authors.length - 1 && (
                    <span style={{ color: 'var(--text-secondary)' }}>→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {result.papers && result.papers.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <strong>Connecting Papers:</strong>
                <ul className="list" style={{ marginTop: '0.5rem' }}>
                  {result.papers.map((paper, index) => (
                    <li key={index} className="list-item">{paper}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="section">
        <h3 className="section-title">💡 Try these examples</h3>
        <div className="grid grid-2">
          <div className="card">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setFromAuthor('Dr. Sarah Chen');
                setToAuthor('Prof. David Kim');
              }}
              style={{ width: '100%' }}
            >
              Dr. Sarah Chen → Prof. David Kim
            </button>
          </div>
          <div className="card">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setFromAuthor('Prof. Michael Rodriguez');
                setToAuthor('Dr. Yuki Tanaka');
              }}
              style={{ width: '100%' }}
            >
              Prof. Michael Rodriguez → Dr. Yuki Tanaka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollaborationPath;

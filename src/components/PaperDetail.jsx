import React, { useState, useEffect } from 'react';

function PaperDetail({ doi, onSelectEntity }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaperData();
  }, [doi]);

  const fetchPaperData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/papers/${encodeURIComponent(doi)}`);
      if (!response.ok) throw new Error('Failed to fetch paper');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span className="loading-text">Loading paper…</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!data) {
    return <div className="empty-state">No data found</div>;
  }

  const { paper = {}, authors = [], topics = [], references = [], citedBy = [] } = data;

  return (
    <div>
      <div className="card">
        <h2 className="card-title">{paper.title}</h2>
        <div className="card-subtitle">
          {paper.year} • DOI: {paper.doi}
        </div>
        <div className="card-content">
          <p>{paper.abstract}</p>
          <div style={{ marginTop: '1rem' }}>
            <strong>Citations:</strong> {citedBy.length} • <strong>References:</strong> {references.length}
          </div>
        </div>
      </div>

      {authors.length > 0 && (
        <div className="section">
          <h3 className="section-title">Authors</h3>
          <div className="card">
            {authors.map((author, index) => (
              <span
                key={index}
                className="badge badge-primary link"
                onClick={() => onSelectEntity({ type: 'author', name: author })}
              >
                {author}
              </span>
            ))}
          </div>
        </div>
      )}

      {topics.length > 0 && (
        <div className="section">
          <h3 className="section-title">Topics</h3>
          <div className="card">
            {topics.map((topic, index) => (
              <span
                key={index}
                className="badge badge-success link"
                onClick={() => onSelectEntity({ type: 'topic', name: topic })}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {references.length > 0 && (
        <div className="section">
          <h3 className="section-title">References ({references.length})</h3>
          <div className="card">
            <ul className="list">
              {references.slice(0, 5).map((ref, index) => (
                <li key={index} className="list-item">
                  {ref.title} ({ref.year})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {citedBy.length > 0 && (
        <div className="section">
          <h3 className="section-title">Cited By ({citedBy.length})</h3>
          <div className="card">
            <ul className="list">
              {citedBy.slice(0, 5).map((cite, index) => (
                <li key={index} className="list-item">
                  {cite.title} ({cite.year})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaperDetail;

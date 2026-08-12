import React, { useState, useEffect } from 'react';

function AuthorDetail({ name, onSelectEntity }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuthorData();
  }, [name]);

  const fetchAuthorData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/authors/${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error('Failed to fetch author');
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
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!data) {
    return <div className="empty-state">No data found</div>;
  }

  const { author, papers, institutions, coauthors } = data;

  return (
    <div>
      <div className="card">
        <h2 className="card-title">👤 {author.name}</h2>
        <div className="card-content">
          <p><strong>Email:</strong> {author.email}</p>
          <p><strong>h-index:</strong> {author.h_index}</p>
          <p><strong>Papers:</strong> {papers.length}</p>
        </div>
      </div>

      {institutions.length > 0 && (
        <div className="section">
          <h3 className="section-title">🏛️ Affiliations</h3>
          <div className="card">
            {institutions.map((inst, index) => (
              <span key={index} className="badge badge-primary">{inst}</span>
            ))}
          </div>
        </div>
      )}

      {papers.length > 0 && (
        <div className="section">
          <h3 className="section-title">📄 Publications ({papers.length})</h3>
          <div className="grid grid-2">
            {papers.map((paper, index) => (
              <div key={index} className="card">
                <div className="card-title" style={{ fontSize: '1rem' }}>
                  {paper.title}
                </div>
                <div className="card-subtitle">
                  {paper.year} {paper.doi && `• DOI: ${paper.doi.substring(0, 20)}...`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {coauthors.length > 0 && (
        <div className="section">
          <h3 className="section-title">🤝 Frequent Collaborators</h3>
          <div className="card">
            {coauthors.map((coauthor, index) => (
              <span
                key={index}
                className="badge badge-secondary link"
                onClick={() => onSelectEntity({ type: 'author', name: coauthor })}
              >
                {coauthor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthorDetail;

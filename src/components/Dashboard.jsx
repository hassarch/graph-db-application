import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [influential, setInfluential] = useState([]);
  const [crossInstitutional, setCrossInstitutional] = useState([]);
  const [topicCooccurrence, setTopicCooccurrence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Endpoints return an array on success but a {error, message} object on
  // failure — coerce so downstream .map/.slice never throw.
  const asArray = (value) => (Array.isArray(value) ? value : []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, influentialRes, crossRes, topicsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/influential-authors'),
        fetch('/api/cross-institutional'),
        fetch('/api/topic-cooccurrence'),
      ]);

      const [statsData, influentialData, crossData, topicsData] = await Promise.all([
        statsRes.json(),
        influentialRes.json(),
        crossRes.json(),
        topicsRes.json(),
      ]);

      setStats(statsData && Array.isArray(statsData.nodes) ? statsData : { nodes: [] });
      setInfluential(asArray(influentialData));
      setCrossInstitutional(asArray(crossData));
      setTopicCooccurrence(asArray(topicsData));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load analytics. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span className="loading-text">Crunching the numbers…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h3>Could not load analytics</h3>
        <p>{error}</p>
        <button className="btn btn-secondary" onClick={fetchAllData} style={{ marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  const nodes = asArray(stats?.nodes);

  return (
    <div>
      <h2 className="section-title">Database Statistics</h2>

      {nodes.length > 0 && (
        <div className="stat-grid">
          {nodes.map((node, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{node.count}</div>
              <div className="stat-label">{node.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="section">
        <h3 className="section-title">Most Influential Authors</h3>
        <div className="card">
          {influential.length === 0 ? (
            <p className="card-subtitle">No author data available.</p>
          ) : (
            <ul className="list">
              {influential.slice(0, 10).map((author, index) => (
                <li key={index} className="list-item">
                  <div className="list-row">
                    <span className="list-row-main">
                      <span className="rank">{index + 1}</span>
                      <strong>{author.name}</strong>
                      <span className="metric">h-index: {author.h_index}</span>
                    </span>
                    <span className="badge-group">
                      <span className="badge badge-primary">{author.citation_count} citations</span>
                      <span className="badge badge-secondary">{author.paper_count} papers</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Cross-Institutional Collaborations</h3>
        {crossInstitutional.length === 0 ? (
          <div className="card"><p className="card-subtitle">No collaborations found.</p></div>
        ) : (
          <div className="grid grid-2">
            {crossInstitutional.slice(0, 6).map((collab, index) => (
              <div key={index} className="card">
                <div className="card-title" style={{ fontSize: '1rem' }}>{collab.title}</div>
                <div className="card-subtitle">{collab.year}</div>
                <div className="card-content" style={{ marginTop: '0.5rem' }}>
                  {(collab.institutions || []).map((inst, i) => (
                    <span key={i} className="badge badge-success">{inst}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h3 className="section-title">Topic Co-occurrence</h3>
        <div className="card">
          <p className="card-subtitle" style={{ marginBottom: '1rem' }}>
            Topics that frequently appear together in papers
          </p>
          {topicCooccurrence.length === 0 ? (
            <p className="card-subtitle">No co-occurrence data available.</p>
          ) : (
            <ul className="list">
              {topicCooccurrence.slice(0, 10).map((item, index) => (
                <li key={index} className="list-item">
                  <div className="list-row">
                    <span className="list-row-main">
                      <span className="badge badge-primary">{item.topic1}</span>
                      <span className="plus">+</span>
                      <span className="badge badge-secondary">{item.topic2}</span>
                    </span>
                    <span className="badge badge-success">{item.cooccurrences} papers</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

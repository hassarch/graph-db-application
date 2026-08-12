import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [influential, setInfluential] = useState([]);
  const [crossInstitutional, setCrossInstitutional] = useState([]);
  const [topicCooccurrence, setTopicCooccurrence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, influentialRes, crossRes, topicsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/influential-authors'),
        fetch('/api/cross-institutional'),
        fetch('/api/topic-cooccurrence')
      ]);

      const statsData = await statsRes.json();
      const influentialData = await influentialRes.json();
      const crossData = await crossRes.json();
      const topicsData = await topicsRes.json();

      setStats(statsData);
      setInfluential(influentialData);
      setCrossInstitutional(crossData);
      setTopicCooccurrence(topicsData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
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

  return (
    <div>
      <h2 className="section-title">📊 Database Statistics</h2>
      
      {stats && (
        <div className="stat-grid">
          {stats.nodes.map((node, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{node.count}</div>
              <div className="stat-label">{node.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="section">
        <h3 className="section-title">🌟 Most Influential Authors</h3>
        <div className="card">
          <ul className="list">
            {influential.slice(0, 10).map((author, index) => (
              <li key={index} className="list-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    <strong>{author.name}</strong>
                    <span className="metric">h-index: {author.h_index}</span>
                  </span>
                  <div>
                    <span className="badge badge-primary">{author.citation_count} citations</span>
                    <span className="badge badge-secondary">{author.paper_count} papers</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">🌍 Cross-Institutional Collaborations</h3>
        <div className="grid grid-2">
          {crossInstitutional.slice(0, 6).map((collab, index) => (
            <div key={index} className="card">
              <div className="card-title" style={{ fontSize: '1rem' }}>
                {collab.title}
              </div>
              <div className="card-subtitle">
                {collab.year}
              </div>
              <div className="card-content" style={{ marginTop: '0.5rem' }}>
                {collab.institutions.map((inst, i) => (
                  <span key={i} className="badge badge-success">{inst}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">🔗 Topic Co-occurrence</h3>
        <div className="card">
          <p className="card-subtitle" style={{ marginBottom: '1rem' }}>
            Topics that frequently appear together in papers
          </p>
          <ul className="list">
            {topicCooccurrence.slice(0, 10).map((item, index) => (
              <li key={index} className="list-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    <span className="badge badge-primary">{item.topic1}</span>
                    <span style={{ margin: '0 0.5rem', color: 'var(--text-secondary)' }}>+</span>
                    <span className="badge badge-secondary">{item.topic2}</span>
                  </span>
                  <span className="badge badge-success">{item.cooccurrences} papers</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

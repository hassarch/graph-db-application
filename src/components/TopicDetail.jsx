import React, { useState, useEffect } from 'react';

function TopicDetail({ name, onSelectEntity }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopicData();
  }, [name]);

  const fetchTopicData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error('Failed to fetch topic');
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
        <span className="loading-text">Loading topic…</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!data) {
    return <div className="empty-state">No data found</div>;
  }

  const { topic = {}, papers = [], subtopics = [], parents = [] } = data;

  return (
    <div>
      <div className="card">
        <h2 className="card-title">{topic.name}</h2>
        <div className="card-content">
          <p>{topic.description}</p>
          <div style={{ marginTop: '1rem' }}>
            <strong>Related Papers:</strong> {papers.length}
          </div>
        </div>
      </div>

      {parents.length > 0 && (
        <div className="section">
          <h3 className="section-title">Parent Topics</h3>
          <div className="card">
            {parents.map((parent, index) => (
              <span
                key={index}
                className="badge badge-primary link"
                onClick={() => onSelectEntity({ type: 'topic', name: parent })}
              >
                {parent}
              </span>
            ))}
          </div>
        </div>
      )}

      {subtopics.length > 0 && (
        <div className="section">
          <h3 className="section-title">Subtopics</h3>
          <div className="card">
            {subtopics.map((subtopic, index) => (
              <span
                key={index}
                className="badge badge-secondary link"
                onClick={() => onSelectEntity({ type: 'topic', name: subtopic })}
              >
                {subtopic}
              </span>
            ))}
          </div>
        </div>
      )}

      {papers.length > 0 && (
        <div className="section">
          <h3 className="section-title">Recent Papers</h3>
          <div className="grid grid-2">
            {papers.slice(0, 10).map((paper, index) => (
              <div key={index} className="card">
                <div className="card-title" style={{ fontSize: '1rem' }}>
                  {paper.title}
                </div>
                <div className="card-subtitle">
                  {paper.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TopicDetail;

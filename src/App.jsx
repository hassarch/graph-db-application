import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import AuthorDetail from './components/AuthorDetail';
import PaperDetail from './components/PaperDetail';
import TopicDetail from './components/TopicDetail';
import CollaborationPath from './components/CollaborationPath';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [dbHealth, setDbHealth] = useState(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setDbHealth(data);
    } catch (err) {
      setDbHealth({ status: 'error', message: 'Cannot connect to server' });
    }
  };

  const handleSearch = async (query, type) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Failed to search. Please check your database connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
    setActiveTab('details');
  };

  const renderContent = () => {
    if (dbHealth?.status !== 'healthy') {
      return (
        <div className="error">
          <h3>⚠️ Database Connection Error</h3>
          <p>{dbHealth?.message || 'Cannot connect to CognoDB'}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Please check your .env file and ensure your CognoDB instance is running.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'search':
        return (
          <>
            <SearchBar onSearch={handleSearch} loading={loading} />
            {error && <div className="error">{error}</div>}
            <SearchResults results={searchResults} onSelect={handleSelectEntity} loading={loading} />
          </>
        );
      
      case 'details':
        if (!selectedEntity) {
          return <div className="empty-state"><p>No entity selected</p></div>;
        }
        
        if (selectedEntity.type === 'author') {
          return <AuthorDetail name={selectedEntity.name} onSelectEntity={handleSelectEntity} />;
        } else if (selectedEntity.type === 'paper') {
          return <PaperDetail doi={selectedEntity.id} onSelectEntity={handleSelectEntity} />;
        } else if (selectedEntity.type === 'topic') {
          return <TopicDetail name={selectedEntity.name} onSelectEntity={handleSelectEntity} />;
        }
        break;
      
      case 'collaboration':
        return <CollaborationPath />;
      
      case 'dashboard':
        return <Dashboard />;
      
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🔬 Research Knowledge Graph Explorer</h1>
        <p>Explore connections between research papers, authors, and topics</p>
        {dbHealth && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            {dbHealth.status === 'healthy' ? (
              <span style={{ color: 'var(--success)' }}>● Connected</span>
            ) : (
              <span style={{ color: 'var(--error)' }}>● Disconnected</span>
            )}
          </div>
        )}
      </header>

      <main>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            🔍 Search
          </button>
          <button
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            📄 Details
          </button>
          <button
            className={`tab ${activeTab === 'collaboration' ? 'active' : ''}`}
            onClick={() => setActiveTab('collaboration')}
          >
            🕸️ Collaboration Path
          </button>
          <button
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Analytics
          </button>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}

export default App;

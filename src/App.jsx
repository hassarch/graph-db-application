import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import AuthorDetail from './components/AuthorDetail';
import PaperDetail from './components/PaperDetail';
import TopicDetail from './components/TopicDetail';
import CollaborationPath from './components/CollaborationPath';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';

const TABS = [
  { id: 'search', label: 'Search' },
  { id: 'details', label: 'Details' },
  { id: 'collaboration', label: 'Collaboration Path' },
  { id: 'dashboard', label: 'Analytics' },
];

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('search');
  // Search state lives here so it survives tab switches and re-mounts.
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
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

  const handleSearch = async (searchQuery, type) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${type}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to search. Please check your database connection.');
      setSearchResults([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
    setActiveTab('details');
  };

  const renderDetails = () => {
    if (!selectedEntity) {
      return (
        <div className="empty-state">
          <h3>Nothing selected</h3>
          <p>Search for an author, paper, or topic and select a result to view details.</p>
          <button className="btn btn-secondary" onClick={() => setActiveTab('search')} style={{ marginTop: '1rem' }}>
            Go to Search
          </button>
        </div>
      );
    }

    if (selectedEntity.type === 'author') {
      return <AuthorDetail key={`author:${selectedEntity.name}`} name={selectedEntity.name} onSelectEntity={handleSelectEntity} />;
    }
    if (selectedEntity.type === 'paper') {
      return <PaperDetail key={`paper:${selectedEntity.id}`} doi={selectedEntity.id} onSelectEntity={handleSelectEntity} />;
    }
    if (selectedEntity.type === 'topic') {
      return <TopicDetail key={`topic:${selectedEntity.name}`} name={selectedEntity.name} onSelectEntity={handleSelectEntity} />;
    }
    return (
      <div className="empty-state">
        <h3>Unknown entity type</h3>
      </div>
    );
  };

  const renderContent = () => {
    if (dbHealth === null) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <span className="loading-text">Connecting to the knowledge graph…</span>
        </div>
      );
    }

    if (dbHealth.status !== 'healthy') {
      return (
        <div className="error">
          <h3>Database Connection Error</h3>
          <p>{dbHealth.message || 'Cannot connect to CognoDB'}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.85 }}>
            Please check your .env file and ensure your CognoDB instance is running.
          </p>
          <button className="btn btn-secondary" onClick={checkHealth} style={{ marginTop: '1rem' }}>
            Retry connection
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'search':
        return (
          <>
            <SearchBar
              query={query}
              type={searchType}
              onQueryChange={setQuery}
              onTypeChange={setSearchType}
              onSearch={handleSearch}
              loading={loading}
            />
            {error && <div className="error">{error}</div>}
            <SearchResults
              results={searchResults}
              onSelect={handleSelectEntity}
              loading={loading}
              hasSearched={hasSearched}
            />
          </>
        );

      case 'details':
        return renderDetails();

      case 'collaboration':
        return <CollaborationPath />;

      case 'dashboard':
        return <Dashboard />;

      default:
        return null;
    }
  };

  const isHealthy = dbHealth?.status === 'healthy';
  // Composite key replays the entrance animation on tab change and on entity
  // navigation within the details view.
  const contentKey =
    activeTab === 'details' && selectedEntity
      ? `details:${selectedEntity.type}:${selectedEntity.id || selectedEntity.name}`
      : activeTab;

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">
            <h1>Research Knowledge Graph Explorer</h1>
            <p>Explore connections between research papers, authors, and topics</p>
          </div>
          {dbHealth && (
            <div className={`status-pill ${isHealthy ? 'status-pill--ok' : 'status-pill--err'}`}>
              <span className="status-dot"></span>
              {isHealthy ? 'Connected' : 'Disconnected'}
            </div>
          )}
        </div>
      </header>

      <main>
        <nav className="tabs" aria-label="Primary">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <ErrorBoundary key={contentKey}>
          <div className="tab-content">{renderContent()}</div>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;

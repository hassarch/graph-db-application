import React from 'react';

function LandingPage({ onEnterApp }) {
  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <span className="landing-logo">RKG Explorer</span>
          <button className="btn btn-primary btn-sm" onClick={onEnterApp}>
            Open App
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <p className="landing-eyebrow">Knowledge Graph Platform</p>
          <h1 className="landing-title">
            Map the landscape of<br />academic research
          </h1>
          <p className="landing-subtitle">
            Explore relationships between papers, authors, and topics.
            Trace collaboration paths, surface influential researchers,
            and uncover hidden connections across disciplines.
          </p>
          <div className="landing-cta-group">
            <button className="btn btn-primary btn-lg" onClick={onEnterApp}>
              Get Started
            </button>
            <a href="#features" className="btn btn-ghost btn-lg">
              Learn More
            </a>
          </div>
        </div>

        {/* Abstract decorative grid */}
        <div className="landing-hero-visual" aria-hidden="true">
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="landing-graph-svg">
            {/* Edges */}
            <line x1="200" y1="60" x2="100" y2="150" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.3" />
            <line x1="200" y1="60" x2="300" y2="130" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.3" />
            <line x1="100" y1="150" x2="160" y2="240" stroke="var(--secondary)" strokeWidth="1.5" strokeOpacity="0.25" />
            <line x1="300" y1="130" x2="260" y2="230" stroke="var(--secondary)" strokeWidth="1.5" strokeOpacity="0.25" />
            <line x1="100" y1="150" x2="300" y2="130" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.15" />
            <line x1="160" y1="240" x2="260" y2="230" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.15" />
            <line x1="200" y1="60" x2="340" y2="220" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.12" />
            <line x1="60" y1="80" x2="200" y2="60" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.2" />
            <line x1="60" y1="80" x2="100" y2="150" stroke="var(--secondary)" strokeWidth="1" strokeOpacity="0.2" />
            {/* Nodes */}
            <circle cx="200" cy="60" r="6" fill="var(--primary)" fillOpacity="0.7" />
            <circle cx="100" cy="150" r="5" fill="var(--secondary)" fillOpacity="0.6" />
            <circle cx="300" cy="130" r="5" fill="var(--primary)" fillOpacity="0.6" />
            <circle cx="160" cy="240" r="4" fill="var(--accent)" fillOpacity="0.5" />
            <circle cx="260" cy="230" r="4" fill="var(--secondary)" fillOpacity="0.5" />
            <circle cx="340" cy="220" r="3" fill="var(--primary)" fillOpacity="0.35" />
            <circle cx="60" cy="80" r="3.5" fill="var(--accent)" fillOpacity="0.4" />
            {/* Subtle pulse ring on the main node */}
            <circle cx="200" cy="60" r="14" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.15" className="pulse-ring" />
          </svg>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features" id="features">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">Core Capabilities</h2>
          <p className="landing-section-desc">
            A complete toolkit for navigating academic knowledge graphs.
          </p>

          <div className="landing-feature-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>Full-Text Search</h3>
              <p>Query across papers, authors, and topics simultaneously. Filter results by entity type for precise discovery.</p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>Collaboration Paths</h3>
              <p>Trace co-authorship chains between any two researchers. Understand how knowledge flows across institutions.</p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3>Research Analytics</h3>
              <p>Surface the most influential authors, cross-institutional partnerships, and trending topic co-occurrences.</p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3>Entity Explorer</h3>
              <p>Dive into detailed views for any author, paper, or topic. Navigate relationships with a single click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="landing-workflow">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">How It Works</h2>
          <p className="landing-section-desc">
            Three steps to meaningful research insights.
          </p>

          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">01</div>
              <h3>Search</h3>
              <p>Enter a researcher name, paper title, or topic keyword to query the knowledge graph.</p>
            </div>
            <div className="landing-step-divider" aria-hidden="true" />
            <div className="landing-step">
              <div className="landing-step-number">02</div>
              <h3>Explore</h3>
              <p>Navigate through connected entities. See co-authors, cited papers, and related topics.</p>
            </div>
            <div className="landing-step-divider" aria-hidden="true" />
            <div className="landing-step">
              <div className="landing-step-number">03</div>
              <h3>Analyze</h3>
              <p>Review analytics dashboards to identify key influencers and collaboration patterns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-bottom-cta">
        <div className="landing-section-inner">
          <h2>Ready to explore?</h2>
          <p>Start navigating the research knowledge graph now.</p>
          <button className="btn btn-primary btn-lg" onClick={onEnterApp}>
            Open the Explorer
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <p>Research Knowledge Graph Explorer</p>
      </footer>
    </div>
  );
}

export default LandingPage;

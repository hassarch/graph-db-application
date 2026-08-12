import React from 'react';

/**
 * Catches render/runtime errors in the subtree and shows a friendly fallback
 * instead of unmounting the whole app (React's default on an uncaught error).
 * Reset it from the parent by giving it a `key` that changes (e.g. the active
 * tab), so navigating away from a broken view recovers automatically.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Render error caught by ErrorBoundary:', error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="empty-state" role="alert">
          <h3>Something went wrong</h3>
          <p>This view hit an unexpected error and couldn’t be displayed.</p>
          <p className="error-detail">{this.state.error.message}</p>
          <button className="btn btn-primary" onClick={this.handleReset} style={{ marginTop: '1rem' }}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

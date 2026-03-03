import React from 'react';

const DefaultFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div style={{ padding: 20, border: '1px solid red', borderRadius: 4 }}>
    <h3>Error</h3>
    <p>{error.message}</p>
    <button onClick={reset}>Try Again</button>
  </div>
);

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}, {
  hasError: boolean;
  error: Error | null;
}> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback || DefaultFallback;
      return <Fallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

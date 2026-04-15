/**
 * SOLUTION — Error Boundary: Widget with Recovery
 */

import React, { useState } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: (props: { error: Error; reset: () => void }) => React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  // Called during render to update state for next render
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Called after render for side effects (logging)
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback({ error: this.state.error, reset: this.reset });
    }
    return this.props.children;
  }
}

function BuggyCounter() {
  const [count, setCount] = useState(0);

  // Throwing during render — this IS caught by Error Boundary
  if (count >= 3) {
    throw new Error('Counter exploded after 3 clicks!');
  }

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count} (click 3 times to break)
    </button>
  );
}

function AsyncErrorDemo() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function riskyOperation(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    throw new Error('Async operation failed!');
  }

  async function handleClick() {
    setError(null);
    setIsLoading(true);
    try {
      await riskyOperation();
    } catch (err) {
      // Async errors in event handlers MUST be caught with try/catch
      // Error boundaries do NOT catch these
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Running...' : 'Trigger Async Error'}
      </button>
      {error && (
        <p style={{ color: 'red' }}>
          Handled manually: {error}
        </p>
      )}
    </div>
  );
}

export default function App() {
  const [key, setKey] = useState(0);

  return (
    <div>
      <h2>Buggy Counter (Error Boundary catches render errors)</h2>
      <ErrorBoundary
        key={key} // Changing key resets the boundary
        fallback={({ error, reset }) => (
          <div style={{ color: 'red', border: '1px solid red', padding: 16 }}>
            <p>Something went wrong: {error.message}</p>
            <button onClick={() => { reset(); setKey(k => k + 1); }}>
              Try Again
            </button>
          </div>
        )}
      >
        <BuggyCounter />
      </ErrorBoundary>

      <hr />

      <h2>Async Error (must handle manually — boundary won't catch)</h2>
      <AsyncErrorDemo />
    </div>
  );
}

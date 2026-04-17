/**
 * SOLUTION — Error Boundary with componentDidCatch + Reset
 */

import React, { useEffect, useState } from 'react';

// ─── ErrorBoundary ────────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  // Called during render — ONLY update state here, no side effects
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Called after render — safe for side effects (logging, reporting)
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught render error:', error.message);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);
    // In production: Sentry.captureException(error, { extra: info });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const reset = () => this.setState({ hasError: false, error: null });
      return this.props.fallback(this.state.error, reset);
    }
    return this.props.children;
  }
}

// ─── Widget a: Render error — caught ✅ ───────────────────────────────────────

function BuggyCounter() {
  const [count, setCount] = useState(0);

  if (count >= 5) {
    throw new Error('Counter overflow! count reached ' + count);
  }

  return (
    <div>
      <p>Count: {count} (crash at 5)</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

// ─── Widget b: Async error — NOT caught (manual handling) ─────────────────────

function AsyncErrorWidget() {
  const [asyncError, setAsyncError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        throw new Error('Async error — not caught by boundary!');
      } catch (e) {
        // Error boundaries only catch synchronous render errors
        // Async errors must be caught and stored in state manually
        setAsyncError((e as Error).message);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <p>Async widget — error will appear after 2s</p>
      {asyncError && (
        <p style={{ color: '#b45309', background: '#fef3c7', padding: 8, borderRadius: 4 }}>
          ⚠️ Caught manually: {asyncError}
        </p>
      )}
    </div>
  );
}

// ─── Widget c: Event error — NOT caught (manual handling) ─────────────────────

function EventErrorWidget() {
  const [eventError, setEventError] = useState<string | null>(null);

  function handleClick() {
    try {
      throw new Error('Event handler error — not caught by boundary!');
    } catch (e) {
      // Event handler errors are NOT caught by error boundaries
      // React swallows them after calling dispatchEvent — must catch manually
      setEventError((e as Error).message);
    }
  }

  return (
    <div>
      <button onClick={handleClick}>Trigger Event Error</button>
      {eventError && (
        <p style={{ color: '#b45309', background: '#fef3c7', padding: 8, borderRadius: 4, marginTop: 8 }}>
          ⚠️ Caught manually: {eventError}
        </p>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [resetKey, setResetKey] = useState(0);

  function handleRetry(boundaryReset: () => void) {
    boundaryReset();           // clears boundary error state
    setResetKey(k => k + 1);  // changes key → React unmounts/remounts BuggyCounter
  }

  const fallbackStyle: React.CSSProperties = {
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    padding: 12,
    borderRadius: 6,
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h1>Error Boundary Reset ✅</h1>

      <section style={{ marginBottom: 32 }}>
        <h2>a) Render Error — Caught by Boundary ✅</h2>
        <p style={{ fontSize: 14, color: '#555' }}>
          Increment 5 times → crash → check console for componentDidCatch log → Retry remounts cleanly.
        </p>
        <ErrorBoundary
          fallback={(error, reset) => (
            <div style={fallbackStyle}>
              <p>💥 {error.message}</p>
              <button onClick={() => handleRetry(reset)}>Retry (key-reset)</button>
            </div>
          )}
        >
          {/* key change unmounts old BuggyCounter, mounts fresh one with count=0 */}
          <BuggyCounter key={resetKey} />
        </ErrorBoundary>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2>b) Async Error — NOT Caught by Boundary</h2>
        <p style={{ fontSize: 14, color: '#555' }}>
          Boundaries only catch synchronous render errors. Async errors need try/catch + setState.
        </p>
        <ErrorBoundary
          fallback={(error, reset) => (
            <div style={fallbackStyle}>
              <p>💥 {error.message}</p>
              <button onClick={() => reset()}>Reset</button>
            </div>
          )}
        >
          <AsyncErrorWidget />
        </ErrorBoundary>
      </section>

      <section>
        <h2>c) Event Handler Error — NOT Caught by Boundary</h2>
        <p style={{ fontSize: 14, color: '#555' }}>
          Event handler errors are not caught by boundaries. Use try/catch inside the handler.
        </p>
        <ErrorBoundary
          fallback={(error, reset) => (
            <div style={fallbackStyle}>
              <p>💥 {error.message}</p>
              <button onClick={() => reset()}>Reset</button>
            </div>
          )}
        >
          <EventErrorWidget />
        </ErrorBoundary>
      </section>
    </div>
  );
}

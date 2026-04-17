/**
 * CHALLENGE — Error Boundary with componentDidCatch + Reset
 *
 * Senior exam tests advanced error boundary usage:
 * - componentDidCatch for observability (logging errors)
 * - The key-reset trick for remounting crashed subtrees
 * - Knowing what boundaries DON'T catch (async, events)
 *
 * TASKS:
 *
 * 1. Implement ErrorBoundary class component with:
 *    - State: { hasError: boolean; error: Error | null }
 *    - getDerivedStateFromError: returns hasError: true
 *    - componentDidCatch: logs error + componentStack (simulates Sentry)
 *    - render: renders children or calls fallback render prop
 *    - Props: { children, fallback(error, reset): ReactNode }
 *
 * 2. Implement the reset strategy:
 *    - The boundary's `reset` callback: setState({ hasError: false, error: null })
 *    - Parent maintains a `resetKey` counter
 *    - When user clicks Retry: call reset() AND increment resetKey
 *    - Pass resetKey as `key` to the wrapped component → forces remount
 *
 * 3. Build three demo widgets:
 *    a. BuggyCounter: crashes on count >= 5 (render error — caught by boundary)
 *    b. AsyncErrorWidget: throws in useEffect — NOT caught (show manual handling)
 *    c. EventErrorWidget: throws in onClick — NOT caught (show manual handling)
 *
 * Key concepts tested:
 * - getDerivedStateFromError vs componentDidCatch (timing + purpose)
 * - key-reset pattern for clean remount
 * - What boundaries catch vs don't catch
 * - componentDidCatch(error, info) — info.componentStack for debugging
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

// TODO 1: Implement ErrorBoundary class component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  // TODO: static getDerivedStateFromError(error: Error): ErrorBoundaryState
  // Returns { hasError: true, error } — called during render phase (no side effects!)

  // TODO: componentDidCatch(error: Error, info: React.ErrorInfo): void
  // Called after render with full stack trace — safe for side effects (logging)
  // console.error('[ErrorBoundary] caught:', error.message, info.componentStack)

  render() {
    // TODO: if hasError → render fallback(error!, reset)
    // TODO: reset = () => this.setState({ hasError: false, error: null })
    return this.props.children;
  }
}

// ─── Widget a: Render error — caught by boundary ──────────────────────────────

function BuggyCounter() {
  const [count, setCount] = useState(0);

  // TODO: if count >= 5, throw new Error('Counter overflow!')
  // This IS caught because it happens during render

  return (
    <div>
      <p>Count: {count} (crash at 5)</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

// ─── Widget b: Async error — NOT caught by boundary ───────────────────────────

function AsyncErrorWidget() {
  const [error, setError] = useState<string | null>(null);

  // TODO: in a useEffect, after 2 seconds, throw an error
  // Wrap in try/catch — error boundaries don't catch async errors
  // Show the error in local state instead

  useEffect(() => {
    // const timer = setTimeout(() => {
    //   try { throw new Error('Async error — not caught by boundary!'); }
    //   catch (e) { setError((e as Error).message); }
    // }, 2000);
    // return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <p>Async widget (error in 2s)</p>
      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}
    </div>
  );
}

// ─── Widget c: Event error — NOT caught by boundary ───────────────────────────

function EventErrorWidget() {
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    // TODO: wrap in try/catch — event handler errors are NOT caught by boundaries
    // try { throw new Error('Event handler error — not caught by boundary!'); }
    // catch (e) { setError((e as Error).message); }
    alert('Implement try/catch here!');
  }

  return (
    <div>
      <button onClick={handleClick}>Trigger Event Error</button>
      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [resetKey, setResetKey] = useState(0);

  function handleRetry(boundaryReset: () => void) {
    boundaryReset();
    setResetKey(k => k + 1); // remounts the subtree via key change
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h1>Error Boundary Reset</h1>

      <section style={{ marginBottom: 24 }}>
        <h2>a) Render Error (caught ✅)</h2>
        <ErrorBoundary
          fallback={(error, reset) => (
            <div style={{ background: '#fee2e2', padding: 12, borderRadius: 6 }}>
              <p>💥 {error.message}</p>
              <button onClick={() => handleRetry(reset)}>Retry</button>
            </div>
          )}
        >
          {/* key={resetKey} forces remount on retry */}
          <BuggyCounter key={resetKey} />
        </ErrorBoundary>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>b) Async Error (NOT caught by boundary)</h2>
        <ErrorBoundary
          fallback={(error, reset) => (
            <div style={{ background: '#fee2e2', padding: 12, borderRadius: 6 }}>
              <p>💥 {error.message}</p>
              <button onClick={() => reset()}>Reset</button>
            </div>
          )}
        >
          <AsyncErrorWidget />
        </ErrorBoundary>
      </section>

      <section>
        <h2>c) Event Handler Error (NOT caught by boundary)</h2>
        <ErrorBoundary
          fallback={(error, reset) => (
            <div style={{ background: '#fee2e2', padding: 12, borderRadius: 6 }}>
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

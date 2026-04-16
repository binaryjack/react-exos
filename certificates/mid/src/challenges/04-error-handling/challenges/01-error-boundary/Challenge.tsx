/**
 * CHALLENGE — Error Boundary: Widget with Recovery
 *
 * 1. Implement a reusable ErrorBoundary class component with:
 *    - A custom fallback prop
 *    - An onReset prop (callback when user clicks "Try Again")
 *    - getDerivedStateFromError and componentDidCatch
 *
 * 2. Build a BuggyCounter widget that:
 *    - Increments a counter on click
 *    - Throws an error when count reaches 3
 *
 * 3. Wrap BuggyCounter in ErrorBoundary with a recovery UI
 *
 * 4. Add a second ErrorBoundary wrapping an async error case:
 *    - A button that calls an async function that rejects
 *    - Use try/catch + setState to display the error (NOT error boundary)
 *      because error boundaries don't catch async/event handler errors
 *
 * Key concepts tested:
 * - Error boundary implementation (must be class component)
 * - getDerivedStateFromError vs componentDidCatch
 * - What error boundaries DO and DON'T catch
 * - Recovery pattern
 */

import React, { useState } from 'react';

// TODO 1: Implement ErrorBoundary class component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: (props: { error: Error; reset: () => void }) => React.ReactNode;
  onReset?: () => void;
}

// class ErrorBoundary extends React.Component<...> { ... }

// TODO 2: BuggyCounter — throws when count >= 3
function BuggyCounter() {
  const [count, setCount] = useState(0);

  // TODO: throw new Error('Counter exploded!') when count >= 3

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count} (click 3 times to break)
    </button>
  );
}

// TODO 3: AsyncErrorDemo — shows async errors are NOT caught by boundaries
function AsyncErrorDemo() {
  // TODO: manage error state manually (error boundaries don't help here)
  // When the button is clicked, call an async function that throws
  // Display the error in the UI using local state

  async function riskyOperation(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    throw new Error('Async operation failed!');
  }

  return (
    <div>
      <button onClick={() => { /* TODO: call riskyOperation, catch error, set state */ }}>
        Trigger Async Error
      </button>
      {/* TODO: show error message if error state is set */}
    </div>
  );
}

export default function App() {
  const [key, setKey] = useState(0);

  return (
    <div>
      <h2>Buggy Counter (Error Boundary catches render errors)</h2>
      {/* TODO: Wrap with ErrorBoundary. Use key={key} to allow reset.
          In fallback, call reset which calls setKey(k => k + 1) */}
      <BuggyCounter />

      <hr />

      <h2>Async Error (must handle manually — boundary won't catch)</h2>
      <AsyncErrorDemo />
    </div>
  );
}

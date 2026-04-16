/**
 * CHALLENGE 03 — use() API: Suspense Integration
 *
 * Demonstrate the `use()` hook with:
 * 1. A `fetchUser(id)` function that returns a Promise<User>
 * 2. A `UserCard` component that calls `use(userPromise)` to read the data
 *    — it suspends automatically while the promise is pending
 * 3. Wrap UserCard in a Suspense boundary with a skeleton fallback
 * 4. An outer ErrorBoundary to catch rejected promises
 * 5. A button to fetch a different user (change the promise)
 *
 * Key insight: unlike useEffect-based fetching, `use()` with Suspense means
 * the component "suspends" — it doesn't render its fallback inline but
 * lets the nearest Suspense boundary handle it.
 *
 * Key concepts tested:
 * - use() hook with Suspense
 * - Difference from useEffect fetching
 * - ErrorBoundary + Suspense combination (the "async UI" pattern)
 * - Promise caching (avoid re-creating the promise on every render)
 */

import React, { use, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// Simulated fetch function — returns a Promise
function fetchUser(id: number): Promise<User> {
  return fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(r => {
    if (!r.ok) throw new Error(`User ${id} not found`);
    return r.json();
  });
}

// TODO 1: Implement UserCard using `use()` hook
// The component receives a promise and reads it synchronously with use()
function UserCard({ userPromise }: { userPromise: Promise<User> }) {
  // TODO: const user = use(userPromise)
  // Then render the user data
  return <div>Loading...</div>;
}

// TODO 2: Implement a simple ErrorBoundary for rejected promises
// (use a class component or import react-error-boundary)
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return <p style={{ color: 'red' }}>Error: {(this.state.error as Error).message}</p>;
    }
    return this.props.children;
  }
}

// TODO 3: Implement App
// - useState for the current userId (start with 1)
// - Create the promise ONCE per userId change (not on every render!)
//   Hint: useState(() => fetchUser(1)) or useMemo
// - Show buttons for users 1-3
// - Wrap UserCard in ErrorBoundary + Suspense (show skeleton while loading)
export default function App() {
  // TODO: implement
  return <div>Implement me</div>;
}

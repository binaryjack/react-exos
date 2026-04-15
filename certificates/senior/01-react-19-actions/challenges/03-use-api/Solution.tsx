/**
 * SOLUTION 03 — use() API: Suspense Integration
 */

import React, { use, useMemo, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

function fetchUser(id: number): Promise<User> {
  return fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(r => {
    if (!r.ok) throw new Error(`User ${id} not found`);
    return r.json();
  });
}

// `use()` reads the promise synchronously — suspends until resolved
// If the promise rejects, the error propagates to the nearest ErrorBoundary
function UserCard({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // suspends here while pending!

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
    </div>
  );
}

function UserSkeleton() {
  return (
    <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8, opacity: 0.4 }}>
      <div style={{ background: '#ccc', height: 20, width: '60%', marginBottom: 8 }} />
      <div style={{ background: '#ccc', height: 14, width: '80%', marginBottom: 6 }} />
      <div style={{ background: '#ccc', height: 14, width: '70%' }} />
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; resetKey: number },
  { error: Error | null }
> {
  state = { error: null };
  componentDidUpdate(prevProps: { resetKey: number }) {
    // Reset error when key changes (user changed)
    if (prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return <p style={{ color: 'red' }}>Error: {(this.state.error as Error).message}</p>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [userId, setUserId] = useState(1);

  // CRITICAL: create the promise only when userId changes, NOT on every render
  // If you create the promise during render without memoization, it re-fetches every render
  const userPromise = useMemo(() => fetchUser(userId), [userId]);

  return (
    <div>
      <h2>User Viewer (use() + Suspense)</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[1, 2, 3].map(id => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            style={{ fontWeight: userId === id ? 'bold' : 'normal' }}
          >
            User {id}
          </button>
        ))}
      </div>

      {/* ErrorBoundary catches rejected promises from use() */}
      <ErrorBoundary resetKey={userId}>
        {/* Suspense shows fallback while UserCard is suspended */}
        <React.Suspense fallback={<UserSkeleton />}>
          <UserCard userPromise={userPromise} />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

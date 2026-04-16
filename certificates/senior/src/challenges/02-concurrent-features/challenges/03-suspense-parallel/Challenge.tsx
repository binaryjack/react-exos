// Challenge: Parallel Suspense Boundaries
//
// In this challenge, you'll implement PARALLEL Suspense boundaries —
// multiple independent loading states that don't block each other.
//
// Compare two approaches:
// A) Waterfall loading (serial) — each section waits for the previous
// B) Parallel loading — all sections load independently at the same time
//
// TASKS:
// TODO 1: Wrap each dashboard section in its OWN Suspense boundary
//         (NOT one outer Suspense for all — that creates waterfall in the component tree)
// TODO 2: Use the `use()` hook to read from promise results in child components
// TODO 3: Add individual Suspense fallbacks with descriptive loading text per section
// TODO 4: Wrap in ErrorBoundary so each section can fail independently
// TODO 5: Add a way to simulate slow loading for one section only

import { Suspense, use } from 'react';

// --- Simulate API calls with configurable delay ---
function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// These promises are created OUTSIDE components (must not recreate on render)
const userProfilePromise = delay(
  { name: 'Alice Smith', role: 'Admin', avatar: '👩‍💻' },
  800
);

const activityFeedPromise = delay(
  [
    { id: 1, action: 'Published article', time: '2 min ago' },
    { id: 2, action: 'Commented on PR #42', time: '15 min ago' },
    { id: 3, action: 'Merged branch feature/auth', time: '1 hour ago' },
  ],
  1500
);

const statsPromise = delay(
  { commits: 142, prs: 18, reviews: 67, streak: 12 },
  600
);

// --- Components that use promised data ---
// TODO 2: Use the `use()` hook inside each component to read from its promise
function UserProfile() {
  // TODO: const profile = use(userProfilePromise);
  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <p>Implement me with use(userProfilePromise)</p>
    </div>
  );
}

function ActivityFeed() {
  // TODO: const activities = use(activityFeedPromise);
  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <p>Implement me with use(activityFeedPromise)</p>
    </div>
  );
}

function StatsPanel() {
  // TODO: const stats = use(statsPromise);
  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <p>Implement me with use(statsPromise)</p>
    </div>
  );
}

// --- Dashboard ---
export default function Dashboard() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h2>Developer Dashboard</h2>
      <p style={{ color: '#666' }}>
        Each section has an independent loading delay:
        Profile (800ms) | Stats (600ms) | Feed (1500ms)
        <br />
        With parallel Suspense, they all load independently — first ready shows first.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
        {/*
          TODO 1: Wrap each component in its OWN <Suspense> with a unique fallback
          TODO 3: Make the fallback descriptive, e.g., "Loading profile..."
          Current: All in ONE Suspense = waterfall (all wait for slowest)
        */}

        {/* TODO: Individual Suspense for UserProfile */}
        <UserProfile />

        {/* TODO: Individual Suspense for StatsPanel */}
        <StatsPanel />

        {/* TODO: Individual Suspense for ActivityFeed — spans both columns */}
        <div style={{ gridColumn: '1 / -1' }}>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

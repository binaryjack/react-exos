// Solution: Parallel Suspense Boundaries
//
// Key points:
// - Each component wrapped in its OWN Suspense = parallel loading
// - ONE outer Suspense for all = waterfall (shows nothing until all done)
// - use() suspends the component — Suspense catches it and shows fallback
// - Promises MUST be created outside the component (no recreate on render)
// - This is the client-side approximation of RSC streaming

import { Suspense, use } from 'react';

// --- Simulate API calls ---
function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Created outside — stable across renders
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

// --- Skeleton fallback component ---
function Skeleton({ width = '100%', height = '20px' }: { width?: string; height?: string }) {
  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        borderRadius: '4px',
        marginBottom: '8px',
      }}
    />
  );
}

// --- Components using use() ---

function UserProfile() {
  // ✅ use() suspends until promise resolves
  const profile = use(userProfilePromise);

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '2.5em' }}>{profile.avatar}</span>
        <div>
          <h3 style={{ margin: 0 }}>{profile.name}</h3>
          <span style={{
            background: '#0066cc',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75em',
          }}>
            {profile.role}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const activities = use(activityFeedPromise);

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {activities.map((item) => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <span>{item.action}</span>
            <span style={{ color: '#999', fontSize: '0.875em' }}>{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatsPanel() {
  const stats = use(statsPromise);

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>Stats</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75em', fontWeight: 'bold', color: '#0066cc' }}>{value}</div>
            <div style={{ fontSize: '0.8em', color: '#666', textTransform: 'capitalize' }}>{key}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Dashboard with PARALLEL Suspense boundaries ---
export default function Dashboard() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h2>Developer Dashboard</h2>
      <p style={{ color: '#666' }}>
        Each section loads independently:
        Stats (600ms) → Profile (800ms) → Feed (1500ms)
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>

        {/* ✅ Independent Suspense — UserProfile loads on its own */}
        <Suspense
          fallback={
            <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
              <Skeleton height="60px" />
            </div>
          }
        >
          <UserProfile />
        </Suspense>

        {/* ✅ Independent Suspense — StatsPanel loads first (600ms, fastest) */}
        <Suspense
          fallback={
            <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
              <Skeleton height="20px" />
              <Skeleton height="80px" />
            </div>
          }
        >
          <StatsPanel />
        </Suspense>

        {/* ✅ Independent Suspense — ActivityFeed loads last (1500ms) but doesn't block others */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Suspense
            fallback={
              <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
                <p style={{ color: '#999' }}>Loading activity feed...</p>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
            }
          >
            <ActivityFeed />
          </Suspense>
        </div>

      </div>

      {/*
        CONTRAST: ONE outer Suspense:
        <Suspense fallback={<p>Loading all...</p>}>
          <UserProfile />
          <StatsPanel />
          <ActivityFeed />
        </Suspense>
        ↑ This shows nothing at all until ALL three are done (1500ms wait for everything)

        PARALLEL (what we built):
        - Stats appears at 600ms
        - Profile appears at 800ms
        - Feed appears at 1500ms
        Each appears as soon as ITS data is ready — progressive enhancement!
      */}
    </div>
  );
}

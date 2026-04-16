/**
 * SOLUTION — Lazy Loading: Route-based Code Splitting
 *
 * In a real app, lazy imports would look like:
 *   const HomeContent = lazy(() => import('./pages/HomeContent'));
 *
 * The key insight: Suspense catches the "suspend" thrown by lazy() and
 * shows the fallback until the dynamic import resolves.
 */

import { lazy, Suspense, useState } from 'react';

// In a real project, these would be separate files and lazy() would handle
// the dynamic import + code splitting. Here we simulate the pattern.

// Real-world example (don't run this here — no separate files):
// const HomeContent = lazy(() => import('./pages/HomeContent'));
// const DashboardContent = lazy(() => import('./pages/DashboardContent'));
// const SettingsContent = lazy(() => import('./pages/SettingsContent'));

// ---- Simulated components ----
function HomeContent() {
  return <div><h2>Home Page</h2><p>Welcome to the app!</p></div>;
}
function DashboardContent() {
  return <div><h2>Dashboard</h2><p>Your analytics and data.</p></div>;
}
function SettingsContent() {
  return <div><h2>Settings</h2><p>Manage your preferences.</p></div>;
}
// -----------------------------

type Page = 'home' | 'dashboard' | 'settings';

function LoadingFallback() {
  return <p style={{ padding: '16px' }}>Loading page...</p>;
}

export default function App() {
  const [page, setPage] = useState<Page>('home');

  function renderPage() {
    switch (page) {
      case 'home': return <HomeContent />;
      case 'dashboard': return <DashboardContent />;
      case 'settings': return <SettingsContent />;
    }
  }

  return (
    <div>
      <nav>
        {(['home', 'dashboard', 'settings'] as Page[]).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{ fontWeight: page === p ? 'bold' : 'normal', marginRight: 8 }}
          >
            {p}
          </button>
        ))}
      </nav>
      <main>
        {/* Suspense at the routing level — one boundary for all pages */}
        <Suspense fallback={<LoadingFallback />}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
}

/**
 * KEY TAKEAWAYS:
 * 
 * 1. React.lazy() MUST receive a function that returns a dynamic import()
 *    ✅ lazy(() => import('./Component'))
 *    ❌ lazy(import('./Component'))  ← wrong — import() called immediately
 * 
 * 2. The component returned by lazy() MUST be the default export
 * 
 * 3. Suspense must exist somewhere above the lazy component in the tree
 * 
 * 4. Granularity: split at route level first, then component level if needed
 *    - Route-level: biggest wins, simplest implementation
 *    - Component-level: for very heavy widgets (charts, editors)
 */

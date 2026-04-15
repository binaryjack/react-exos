/**
 * CHALLENGE — Lazy Loading: Route-based Code Splitting
 *
 * The app currently imports all page components eagerly.
 * Refactor it to use React.lazy() and Suspense for code splitting.
 *
 * Requirements:
 * 1. Make all three "page" components lazy-loaded
 * 2. Show a "Loading page..." fallback while the page loads
 * 3. Use Suspense at the routing level (not per-page)
 * 4. Verify in DevTools Network tab that you see separate chunks
 *
 * Note: In a real app you'd use React Router. Here we simulate routing
 * with simple state to keep things self-contained.
 *
 * Key concepts tested:
 * - React.lazy() for dynamic imports
 * - Suspense for loading boundaries
 * - Code splitting granularity decisions
 */

import { lazy, Suspense, useState } from 'react';

// TODO 1: Convert these to lazy imports
// Before: import HomeContent from './HomeContent';
// After:  const HomeContent = lazy(() => import('./HomeContent'));

// Since we can't have separate files here, we'll simulate with
// components that have artificial delays.

// ---- Simulated "heavy" page components (pretend these are in separate files) ----
function HomeContent() {
  return <div><h2>Home Page</h2><p>Welcome to the app!</p></div>;
}

function DashboardContent() {
  return <div><h2>Dashboard</h2><p>Your analytics and data.</p></div>;
}

function SettingsContent() {
  return <div><h2>Settings</h2><p>Manage your preferences.</p></div>;
}
// ---------------------------------------------------------------------------------

type Page = 'home' | 'dashboard' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('home');

  // TODO 2: Wrap the page render in a Suspense boundary
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
        {/* TODO 3: Wrap with Suspense and show fallback */}
        {renderPage()}
      </main>
    </div>
  );
}

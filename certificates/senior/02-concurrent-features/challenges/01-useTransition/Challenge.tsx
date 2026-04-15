/**
 * CHALLENGE 01 — useTransition: Smooth Tab Navigation
 *
 * A tab panel has 3 tabs. Tab "Reports" renders an expensive component
 * that takes ~200ms to render (simulated with a loop).
 *
 * Without useTransition: clicking "Reports" freezes the input for 200ms
 * With useTransition: the input remains responsive, and the previous tab
 * stays visible until the new one is ready (with a loading indicator)
 *
 * Tasks:
 * 1. Wrap the tab change in startTransition
 * 2. Use isPending to show a visual indicator on the active tab
 * 3. Apply opacity to the tab content while pending
 * 4. Show that the search input (outside tabs) remains responsive
 *
 * Key concepts tested:
 * - useTransition for expensive renders
 * - isPending as a loading indicator
 * - Keeping urgent UI (input) responsive during non-urgent renders
 */

import { memo, useTransition, useState } from 'react';

// Simulates an expensive component (blocks the main thread for ~200ms)
const ReportsTab = memo(function ReportsTab() {
  const start = performance.now();
  // Artificially expensive render
  while (performance.now() - start < 200) { /* burn CPU */ }

  return (
    <ul>
      {Array.from({ length: 100 }, (_, i) => (
        <li key={i}>Report #{i + 1} — Q{(i % 4) + 1} 2024</li>
      ))}
    </ul>
  );
});

function ContactsTab() {
  return <p>Contacts: Alice, Bob, Charlie</p>;
}

function SettingsTab() {
  return <p>Settings: notifications, theme, account</p>;
}

type Tab = 'contacts' | 'reports' | 'settings';

// TODO 1: Implement TabBar — shows the tabs and handles click
// Clicking should call onTabChange wrapped in startTransition
// The active tab button should show "(loading...)" while isPending
function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  // TODO: use useTransition here
  const tabs: Tab[] = ['contacts', 'reports', 'settings'];
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)} // TODO: wrap in startTransition
          style={{ fontWeight: activeTab === tab ? 'bold' : 'normal' }}
        >
          {tab} {/* TODO: show "(loading...)" on activeTab when isPending */}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('contacts');
  const [search, setSearch] = useState('');

  // TODO 2: Track isPending from TabBar and apply opacity to content
  // (or move transition management up here)

  function renderTab() {
    switch (activeTab) {
      case 'contacts': return <ContactsTab />;
      case 'reports': return <ReportsTab />;
      case 'settings': return <SettingsTab />;
    }
  }

  return (
    <div>
      {/* This input should stay responsive even during expensive renders */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search (should stay responsive)..."
        style={{ display: 'block', marginBottom: 16 }}
      />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div /* TODO: apply opacity when isPending */>
        {renderTab()}
      </div>
    </div>
  );
}

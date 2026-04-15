/**
 * SOLUTION 01 — useTransition: Smooth Tab Navigation
 */

import { memo, useTransition, useState } from 'react';

const ReportsTab = memo(function ReportsTab() {
  const start = performance.now();
  while (performance.now() - start < 200) { /* expensive render */ }
  return (
    <ul>
      {Array.from({ length: 100 }, (_, i) => (
        <li key={i}>Report #{i + 1} — Q{(i % 4) + 1} 2024</li>
      ))}
    </ul>
  );
});

function ContactsTab() { return <p>Contacts: Alice, Bob, Charlie</p>; }
function SettingsTab() { return <p>Settings: notifications, theme, account</p>; }

type Tab = 'contacts' | 'reports' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('contacts');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  const tabs: Tab[] = ['contacts', 'reports', 'settings'];

  function handleTabChange(tab: Tab) {
    // Mark as non-urgent — React can interrupt this to handle keystrokes
    startTransition(() => setActiveTab(tab));
  }

  function renderTab() {
    switch (activeTab) {
      case 'contacts': return <ContactsTab />;
      case 'reports': return <ReportsTab />;
      case 'settings': return <SettingsTab />;
    }
  }

  return (
    <div>
      {/* This stays fully responsive — it's outside the transition */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search (stays responsive during tab switch)..."
        style={{ display: 'block', marginBottom: 16 }}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{ fontWeight: activeTab === tab ? 'bold' : 'normal' }}
          >
            {tab}
            {/* Show loading indicator on the TAB BEING ACTIVATED while pending */}
            {isPending && activeTab !== tab ? '' : ''}
            {isPending ? ' ⏳' : ''}
          </button>
        ))}
      </div>

      {/* While pending: keep showing previous content at reduced opacity */}
      <div style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {renderTab()}
      </div>
    </div>
  );
}

/**
 * KEY TAKEAWAYS:
 * 
 * Without startTransition:
 * - Clicking "Reports" blocks the main thread for 200ms
 * - The input freezes during this time
 * 
 * With startTransition:
 * - The tab change is marked as non-urgent
 * - React processes keystrokes immediately
 * - The previous tab content stays visible (reduced opacity) while Reports loads
 * - isPending tells you the transition is in progress
 */

// Solution: Advanced Compound Components — Tabs
//
// Key points:
// - Context connects Tabs root to all sub-components
// - ARIA: role="tablist", role="tab", role="tabpanel" + aria-selected + aria-controls/labelledby
// - Keyboard: ArrowLeft/Right in the TabList div using onKeyDown + focus management
// - TabPanel uses `hidden` attribute (not conditional render) so DOM is always present
// - Sub-components attached as static properties for clean consumer API

import { Children, createContext, isValidElement, useContext, useRef, useState } from 'react';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Tabs>`);
  return ctx;
}

// Root
interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
}

function Tabs({ defaultTab, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

// TabList with keyboard navigation
function TabList({ children }: { children: React.ReactNode }) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!listRef.current) return;
    const tabs = Array.from(
      listRef.current.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    );
    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = tabs[(currentIndex + 1) % tabs.length];
      next.focus();
      next.click();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
      prev.focus();
      prev.click();
    }
  }

  return (
    <div ref={listRef} role="tablist" onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}

// Tab
interface TabProps {
  id: string;
  children: React.ReactNode;
}

function Tab({ id, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext('Tabs.Tab');
  const isSelected = activeTab === id;

  return (
    <button
      id={`tab-${id}`}
      role="tab"
      aria-selected={isSelected}
      aria-controls={`panel-${id}`}
      tabIndex={isSelected ? 0 : -1} // roving tabindex for keyboard nav
      onClick={() => setActiveTab(id)}
      style={{
        padding: '8px 16px',
        background: isSelected ? '#0066cc' : '#f0f0f0',
        color: isSelected ? '#fff' : '#333',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '4px 4px 0 0',
      }}
    >
      {children}
    </button>
  );
}

// TabPanel — uses hidden attribute, always in DOM
interface TabPanelProps {
  id: string;
  children: React.ReactNode;
}

function TabPanel({ id, children }: TabPanelProps) {
  const { activeTab } = useTabsContext('Tabs.Panel');

  return (
    <div
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      hidden={activeTab !== id} // ← key: stays in DOM, just hidden
      style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '0 4px 4px 4px' }}
    >
      {children}
    </div>
  );
}

// Attach sub-components
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// --- Demo ---
export default function TabsDemo() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h2>Tabs Demo</h2>
      <p>Use Arrow keys to navigate between tabs.</p>
      <Tabs defaultTab="overview">
        <Tabs.List>
          <Tabs.Tab id="overview">Overview</Tabs.Tab>
          <Tabs.Tab id="details">Details</Tabs.Tab>
          <Tabs.Tab id="reviews">Reviews</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="overview">
          <p>Overview content — always in DOM, hidden when inactive (check DevTools!)</p>
        </Tabs.Panel>
        <Tabs.Panel id="details">
          <p>Details content — forms inside retain their values when switching tabs</p>
          <input placeholder="This input keeps its value" />
        </Tabs.Panel>
        <Tabs.Panel id="reviews">
          <p>Reviews content</p>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

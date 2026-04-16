// Challenge: Advanced Compound Components — Tabs
//
// Build a fully accessible <Tabs> compound component.
//
// REQUIREMENTS:
// - Tabs.List wraps Tab buttons (role="tablist")
// - Tabs.Tab renders a button (role="tab", aria-selected, aria-controls)
// - Tabs.Panel renders content (role="tabpanel", aria-labelledby, hidden when inactive)
// - Keyboard navigation: ArrowLeft / ArrowRight moves between tabs
// - All sub-components are attached to Tabs (Tabs.List, Tabs.Tab, Tabs.Panel)
//
// TASKS:
// TODO 1: Create TabsContext with { activeTab, setActiveTab }
// TODO 2: Implement Tabs root component that manages activeTab state
// TODO 3: Implement TabList — wraps children with role="tablist"
// TODO 4: Implement Tab — button with role="tab", aria-selected, handles click + keyboard
// TODO 5: Implement TabPanel — renders only when its id === activeTab
// TODO 6: Attach sub-components to Tabs (Tabs.List = TabList, etc.)
// TODO 7: Add keyboard navigation (ArrowLeft/Right) in TabList

import { createContext, useContext, useState } from 'react';

// TODO 1: Define context interface and create context
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs sub-components must be used inside <Tabs>');
  return ctx;
}

// TODO 2: Tabs root
interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
}

function Tabs({ defaultTab, children }: TabsProps) {
  // TODO: useState for activeTab
  // TODO: wrap children in TabsContext.Provider
  return <div>{children}</div>; // placeholder
}

// TODO 3: TabList
function TabList({ children }: { children: React.ReactNode }) {
  // TODO: return a div with role="tablist"
  // TODO: handle ArrowLeft/ArrowRight keyboard navigation
  return <div>{children}</div>; // placeholder
}

// TODO 4: Tab
interface TabProps {
  id: string;
  children: React.ReactNode;
}

function Tab({ id, children }: TabProps) {
  // TODO: get context
  // TODO: render button with role="tab", aria-selected, aria-controls={`panel-${id}`}
  // TODO: id attribute for aria-labelledby on panel: `tab-${id}`
  return <button>{children}</button>; // placeholder
}

// TODO 5: TabPanel
interface TabPanelProps {
  id: string;
  children: React.ReactNode;
}

function TabPanel({ id, children }: TabPanelProps) {
  // TODO: get context, show/hide based on activeTab === id
  // TODO: role="tabpanel", aria-labelledby={`tab-${id}`}, id={`panel-${id}`}
  // TODO: use hidden attribute instead of conditional render (keeps DOM for accessibility)
  return <div>{children}</div>; // placeholder
}

// TODO 6: Attach sub-components
// Tabs.List = TabList;
// Tabs.Tab = Tab;
// Tabs.Panel = TabPanel;

// --- Demo ---
export default function TabsDemo() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h2>Tabs Demo</h2>
      <Tabs defaultTab="overview">
        <TabList>
          <Tab id="overview">Overview</Tab>
          <Tab id="details">Details</Tab>
          <Tab id="reviews">Reviews</Tab>
        </TabList>
        <TabPanel id="overview">
          <p>Overview content — always in DOM, hidden when inactive</p>
        </TabPanel>
        <TabPanel id="details">
          <p>Details content</p>
        </TabPanel>
        <TabPanel id="reviews">
          <p>Reviews content</p>
        </TabPanel>
      </Tabs>
    </div>
  );
}

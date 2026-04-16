/**
 * SOLUTION 01 — Compound Components: Accordion
 */

import { createContext, useContext, useState } from 'react';

// Accordion-level context: which item is open
interface AccordionContextValue {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}
const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Must be used within Accordion');
  return ctx;
}

// Item-level context: what is this item's id
const ItemContext = createContext<string | null>(null);

function useItemContext() {
  const id = useContext(ItemContext);
  if (id === null) throw new Error('Must be used within Accordion.Item');
  return id;
}

// Root
function Accordion({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <AccordionContext.Provider value={{ activeId, setActiveId }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
}

// Item — provides its id to children
Accordion.Item = function AccordionItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <ItemContext.Provider value={id}>
      <div style={{ borderBottom: '1px solid #ccc' }}>{children}</div>
    </ItemContext.Provider>
  );
};

// Trigger — toggles active item
Accordion.Trigger = function AccordionTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeId, setActiveId } = useAccordionContext();
  const id = useItemContext();
  const isOpen = activeId === id;

  return (
    <button
      aria-expanded={isOpen}
      onClick={() => setActiveId(isOpen ? null : id)}
      style={{ width: '100%', textAlign: 'left', padding: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
    >
      {children} {isOpen ? '▲' : '▼'}
    </button>
  );
};

// Panel — shows when its id is active
Accordion.Panel = function AccordionPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeId } = useAccordionContext();
  const id = useItemContext();
  const isOpen = activeId === id;

  if (!isOpen) return null;

  return (
    <div role="region" style={{ padding: '12px' }}>
      {children}
    </div>
  );
};

export default function App() {
  return (
    <Accordion>
      <Accordion.Item id="react">
        <Accordion.Trigger>What is React?</Accordion.Trigger>
        <Accordion.Panel>
          React is a JavaScript library for building user interfaces.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item id="hooks">
        <Accordion.Trigger>What are Hooks?</Accordion.Trigger>
        <Accordion.Panel>
          Hooks let you use state and other React features in function components.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item id="context">
        <Accordion.Trigger>What is Context?</Accordion.Trigger>
        <Accordion.Panel>
          Context provides a way to pass data without prop drilling.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

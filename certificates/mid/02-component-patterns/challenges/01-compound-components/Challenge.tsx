/**
 * CHALLENGE 01 — Compound Components: Accordion
 *
 * Build an Accordion component using the compound component pattern:
 *
 * API should work like this:
 * <Accordion>
 *   <Accordion.Item id="a">
 *     <Accordion.Trigger>Section A</Accordion.Trigger>
 *     <Accordion.Panel>Content A</Accordion.Panel>
 *   </Accordion.Item>
 *   <Accordion.Item id="b">
 *     <Accordion.Trigger>Section B</Accordion.Trigger>
 *     <Accordion.Panel>Content B</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion>
 *
 * Requirements:
 * 1. Only ONE panel open at a time (clicking an open item closes it)
 * 2. The Accordion manages "which item is open" state
 * 3. Items get their `id` from their parent via context
 * 4. Trigger toggles its panel (close if already open)
 * 5. Panel is visible only when its id matches the active id
 * 6. Add proper ARIA attributes: aria-expanded on trigger, role="region" on panel
 *
 * Key concepts tested:
 * - Context threading through compound components
 * - Multiple context levels (accordion context + item context)
 * - Sub-component pattern in TypeScript (Accordion.Item, etc.)
 */

import { createContext, useContext, useState } from 'react';

// TODO 1: Define context types and create contexts

// TODO 2: Implement Accordion root component
function Accordion({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

// TODO 3: Implement Accordion.Item
// Provides the item's `id` to its children via a separate ItemContext
Accordion.Item = function AccordionItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
};

// TODO 4: Implement Accordion.Trigger
// Reads both contexts to toggle the active item
Accordion.Trigger = function AccordionTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return <button>{children}</button>;
};

// TODO 5: Implement Accordion.Panel
// Shows content only when its item's id matches the activeId
Accordion.Panel = function AccordionPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
};

// Demo
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

/**
 * CHALLENGE 02 — useDeferredValue: Search with Stale UI
 *
 * Build a live search that:
 * 1. Has a text input that updates a `query` state on every keystroke
 * 2. Uses `useDeferredValue` so the expensive search results don't block typing
 * 3. Shows a "stale" indicator (reduced opacity) when the displayed results
 *    are behind the current query
 * 4. The ExpensiveSearchResults component is wrapped in React.memo
 *    (critical: without memo, deferral doesn't help because it re-renders anyway)
 *
 * Key concepts tested:
 * - useDeferredValue for values you don't control the setter of
 * - The `isStale` pattern: query !== deferredQuery
 * - React.memo required for deferral to work effectively
 * - When to use useDeferredValue vs useTransition
 */

import { memo, useDeferredValue, useState } from 'react';

// Simulated search dataset
const ALL_ITEMS = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  label: `Item ${i} — ${['React', 'Vue', 'Angular', 'Svelte', 'TypeScript'][i % 5]} topic ${i}`,
}));

// Expensive filter — simulates slow filtering of large dataset
// TODO 1: Wrap with React.memo — critical for useDeferredValue to work
function ExpensiveSearchResults({ query }: { query: string }) {
  // Simulate expensive computation
  const start = performance.now();
  while (performance.now() - start < 50) { /* burn CPU */ }

  const results = ALL_ITEMS.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 20);

  if (!query) return <p>Start typing to search...</p>;

  return (
    <ul>
      {results.map(item => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  );
}

export default function SearchApp() {
  const [query, setQuery] = useState('');

  // TODO 2: Create deferredQuery using useDeferredValue
  // TODO 3: Compute isStale = query !== deferredQuery

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search 5000 items..."
      />
      {/* TODO 4: Apply reduced opacity when isStale */}
      {/* TODO 5: Pass deferredQuery (not query) to ExpensiveSearchResults */}
      <ExpensiveSearchResults query={query} />
    </div>
  );
}

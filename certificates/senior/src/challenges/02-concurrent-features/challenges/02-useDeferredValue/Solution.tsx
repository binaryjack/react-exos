/**
 * SOLUTION 02 — useDeferredValue: Search with Stale UI
 */

import { memo, useDeferredValue, useState } from 'react';

const ALL_ITEMS = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  label: `Item ${i} — ${['React', 'Vue', 'Angular', 'Svelte', 'TypeScript'][i % 5]} topic ${i}`,
}));

// React.memo is REQUIRED — without it, ExpensiveSearchResults re-renders
// on every keystroke regardless of deferral (props haven't changed shallowly,
// but the component would still re-render with the parent)
const ExpensiveSearchResults = memo(function ExpensiveSearchResults({
  query,
}: {
  query: string;
}) {
  const start = performance.now();
  while (performance.now() - start < 50) { /* expensive */ }

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
});

export default function SearchApp() {
  const [query, setQuery] = useState('');

  // deferredQuery lags behind `query` during rapid updates
  // React will re-render with the old deferredQuery first (fast),
  // then schedule a lower-priority re-render with the new deferredQuery
  const deferredQuery = useDeferredValue(query);

  // When query has moved ahead of deferredQuery, results are "stale"
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search 5000 items..."
      />
      {isStale && <small style={{ color: 'gray' }}> searching...</small>}

      {/* Reduced opacity signals to the user that content is updating */}
      <div style={{ opacity: isStale ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        <ExpensiveSearchResults query={deferredQuery} />
      </div>
    </div>
  );
}

/**
 * KEY TAKEAWAYS:
 * 
 * - Without useDeferredValue: input lags because filtering blocks rendering
 * - With useDeferredValue + memo: input is instant, results catch up async
 * 
 * When to use useDeferredValue vs useTransition:
 * - useDeferredValue: you receive a value from props/state and can't control the setter
 * - useTransition: you control the state update (have access to the setter)
 */

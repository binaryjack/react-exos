/**
 * CHALLENGE 06 — useMemo + useCallback: List Optimization
 *
 * A list of 10,000 items is rendered. There's a filter input and a parent counter.
 * The problem: every time the parent counter changes, the filtered list re-computes
 * and the ListItem component re-renders even though nothing list-related changed.
 *
 * Your tasks:
 * 1. Memoize the filtered list calculation with useMemo
 * 2. Memoize the onDelete handler with useCallback
 * 3. Wrap ListItem with React.memo to prevent unnecessary re-renders
 * 4. Verify the Parent counter increment does NOT cause list re-renders
 *    (add a console.log inside ListItem to verify)
 *
 * Key concepts tested:
 * - useMemo for expensive calculations
 * - useCallback for stable function references
 * - React.memo for preventing unnecessary re-renders
 * - Understanding when memoization actually helps
 */

import { memo, useCallback, useMemo, useState } from 'react';

// Simulate a large dataset
const ALL_ITEMS = Array.from({ length: 10_000 }, (_, i) => ({
  id: i,
  name: `Item ${i} - ${Math.random().toString(36).slice(2, 8)}`,
}));

interface Item {
  id: number;
  name: string;
}

// TODO 1: Wrap with React.memo to prevent re-renders when props haven't changed
// TODO: add a console.log('ListItem render', item.id) to observe renders
function ListItem({ item, onDelete }: { item: Item; onDelete: (id: number) => void }) {
  return (
    <li key={item.id}>
      {item.name}
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </li>
  );
}

export default function OptimizedList() {
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState<Item[]>(ALL_ITEMS);
  const [parentCounter, setParentCounter] = useState(0);

  // TODO 2: Memoize this calculation with useMemo
  // (currently recomputes on every render including parentCounter changes)
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  // TODO 3: Memoize with useCallback — correct dependencies!
  // (currently creates a new function reference on every render)
  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div>
      <button onClick={() => setParentCounter(c => c + 1)}>
        Parent counter: {parentCounter}
      </button>

      <input
        placeholder="Filter items..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <p>Showing {filteredItems.length} items</p>

      <ul>
        {filteredItems.slice(0, 20).map(item => (
          <ListItem key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}

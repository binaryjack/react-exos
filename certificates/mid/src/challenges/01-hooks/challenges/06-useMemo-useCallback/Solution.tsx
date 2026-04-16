/**
 * SOLUTION 06 — useMemo + useCallback: List Optimization
 */

import { memo, useCallback, useMemo, useState } from 'react';

const ALL_ITEMS = Array.from({ length: 10_000 }, (_, i) => ({
  id: i,
  name: `Item ${i} - ${Math.random().toString(36).slice(2, 8)}`,
}));

interface Item {
  id: number;
  name: string;
}

// React.memo: only re-renders when props change (shallow compare)
// console.log here lets you verify it only renders when list-related things change
const ListItem = memo(function ListItem({
  item,
  onDelete,
}: {
  item: Item;
  onDelete: (id: number) => void;
}) {
  console.log('ListItem render', item.id);
  return (
    <li>
      {item.name}
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </li>
  );
});

export default function OptimizedList() {
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState<Item[]>(ALL_ITEMS);
  const [parentCounter, setParentCounter] = useState(0);

  // useMemo: only recomputes when `items` or `filter` changes
  // Incrementing parentCounter does NOT trigger this
  const filteredItems = useMemo(
    () => items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase())),
    [items, filter]
  );

  // useCallback: same function reference across renders
  // ListItem wrapped in memo will NOT re-render when parentCounter changes
  const handleDelete = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []); // no dependencies — setItems is stable

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

/**
 * NOTE: With React Compiler enabled (React 19+), you don't write
 * useMemo and useCallback manually — the compiler handles this automatically.
 * BUT you still need to understand the mental model for the exam.
 */

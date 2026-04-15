// Solution: React Compiler - Auto Memoization
//
// Key takeaways:
// 1. React.memo on components prevents re-render when props haven't changed
// 2. useCallback stabilizes function references so memo'd children don't break
// 3. useMemo caches expensive computations
// 4. With React Compiler, (1)(2)(3) happen automatically — you write clean code,
//    the compiler inserts memoization where it's safe and beneficial.
// 5. The Rules of React violation was: mutating items array elements during render.
//    The compiler detects this and disables optimization for the affected code.

import { memo, useCallback, useMemo, useState } from 'react';

function computeStats(numbers: number[]): { sum: number; avg: number; max: number } {
  let sum = 0;
  for (const n of numbers) sum += n;
  return { sum, avg: sum / numbers.length, max: Math.max(...numbers) };
}

// ✅ Wrapped with memo — only re-renders when label or value changes
const StatCard = memo(function StatCard({ label, value }: { label: string; value: number }) {
  console.log(`StatCard "${label}" rendered`);
  return (
    <div style={{ border: '1px solid #ccc', padding: '8px', margin: '4px', borderRadius: '4px' }}>
      <strong>{label}:</strong> {value.toFixed(2)}
    </div>
  );
});

// ✅ Wrapped with memo — only re-renders when item or onDelete changes
const ItemRow = memo(function ItemRow({
  item,
  onDelete,
}: {
  item: { id: number; value: number };
  onDelete: (id: number) => void;
}) {
  console.log(`ItemRow ${item.id} rendered`);
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
      <span>Item {item.id}: {item.value}</span>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
});

export default function DataDashboard() {
  const [items, setItems] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({ id: i + 1, value: Math.round(Math.random() * 100) }))
  );
  const [counter, setCounter] = useState(0);

  // ✅ useMemo — computeStats is expensive and only needed when items change
  const stats = useMemo(
    () => computeStats(items.map((i) => i.value)),
    [items]
  );

  // ✅ useCallback — stable reference so ItemRow memo works correctly
  // Without this, every render creates a new function → ItemRow always re-renders
  const handleDelete = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []); // empty deps: setItems is stable, no other deps needed

  // ✅ No Rules of React violations here:
  // - No mutations during render
  // - No side effects during render
  // - Pure computation only

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h2>Data Dashboard</h2>

      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setCounter((c) => c + 1)}>
          Increment Counter: {counter}
        </button>
        <small style={{ marginLeft: '8px', color: '#666' }}>
          (This does NOT re-render stats or item rows — check the console!)
        </small>
      </div>

      <h3>Stats</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <StatCard label="Sum" value={stats.sum} />
        <StatCard label="Average" value={stats.avg} />
        <StatCard label="Max" value={stats.max} />
      </div>

      <h3>Items</h3>
      {items.map((item) => (
        <ItemRow key={item.id} item={item} onDelete={handleDelete} />
      ))}

      {/*
        WITH REACT COMPILER:
        You would write the component WITHOUT memo/useMemo/useCallback.
        The compiler analyzes the data flow and adds the same optimizations automatically.

        What you'd still need:
        - Pure components (no mutations during render)
        - Rules of Hooks followed
        - Good state structure (compiler can't fix "where does state live?")

        What becomes optional:
        - React.memo() wrappers
        - useMemo() for derived values
        - useCallback() for stable function references
      */}
    </div>
  );
}

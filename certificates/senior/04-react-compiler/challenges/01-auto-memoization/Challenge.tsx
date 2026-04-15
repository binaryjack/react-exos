// Challenge: React Compiler - Auto Memoization
//
// This component is written WITHOUT any manual memoization.
// The React Compiler would handle this automatically — but you need to
// identify WHERE and WHY memoization is applied.
//
// TASKS:
// 1. TODO: This component is slow. Add manual memoization as if you were
//    the React Compiler. Use React.memo, useMemo, and useCallback.
//
// 2. TODO: Identify and fix the Rules of React violation hidden in this file.
//    (The compiler would refuse to optimize code with this bug!)
//
// 3. TODO: After fixing, which optimizations become unnecessary with the compiler?
//    Add a comment explaining your answer.
//
// Run this and open React DevTools Profiler to see re-renders before/after.

import { useState } from 'react';

// --- Simulated expensive computation ---
function computeStats(numbers: number[]): { sum: number; avg: number; max: number } {
  // Fake expensive work
  let sum = 0;
  for (const n of numbers) sum += n;
  return { sum, avg: sum / numbers.length, max: Math.max(...numbers) };
}

// --- Child component that renders a single stat card ---
// TODO: Wrap with React.memo to prevent unnecessary re-renders
function StatCard({ label, value }: { label: string; value: number }) {
  console.log(`StatCard "${label}" rendered`);
  return (
    <div style={{ border: '1px solid #ccc', padding: '8px', margin: '4px', borderRadius: '4px' }}>
      <strong>{label}:</strong> {value.toFixed(2)}
    </div>
  );
}

// --- Row component that renders an item and a delete button ---
// TODO: Wrap with React.memo
function ItemRow({
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
}

// --- Main component ---
export default function DataDashboard() {
  const [items, setItems] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({ id: i + 1, value: Math.round(Math.random() * 100) }))
  );
  const [counter, setCounter] = useState(0);

  // TODO: Memoize this — computeStats is expensive and items rarely changes
  const stats = computeStats(items.map((i) => i.value));

  // TODO: Memoize this callback — it's recreated on every render, breaking StatCard/ItemRow memo
  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // RULES OF REACT VIOLATION: Find it and fix it.
  // Hint: something is happening during render that shouldn't be.
  const log: string[] = [];
  log.push(`Rendered at ${new Date().toISOString()}`);
  console.log(log); // this itself is fine for debugging, but something else here is wrong...
  // Actually look at this:
  items.forEach((item) => {
    item.value = item.value; // <- is this fine? what if it was item.value += 1 ?
  });
  // ^ The above is safe. The violation to find is more subtle — look at the mutation below:
  // Uncomment this to reveal it:
  // items[0] = { ...items[0], value: 999 }; // mutating items array slot — violation!

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h2>Data Dashboard</h2>

      {/* Counter that causes re-renders — should NOT cause children to re-render */}
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setCounter((c) => c + 1)}>
          Increment Counter: {counter}
        </button>
        <small style={{ marginLeft: '8px', color: '#666' }}>
          (This should not re-render stats or item rows)
        </small>
      </div>

      {/* Stats section */}
      <h3>Stats</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <StatCard label="Sum" value={stats.sum} />
        <StatCard label="Average" value={stats.avg} />
        <StatCard label="Max" value={stats.max} />
      </div>

      {/* Items list */}
      <h3>Items</h3>
      {items.map((item) => (
        <ItemRow key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </div>
  );
}

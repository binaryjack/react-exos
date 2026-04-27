import React, { useState, useMemo } from 'react';
import { generateItems, Item } from './data';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Identify why typing in the search box is slow.
 * 2. Optimize Row rendering using React.memo.
 * 3. Use useCallback for the onSelect handler.
 * 4. Use useMemo for the filtered items list.
 * 5. Verify that only relevant rows re-render when the selection or filter changes.
 */

// ANTI-PATTERN: This component re-renders every time the parent does
const Row = ({ item, isSelected, onSelect }: { item: Item, isSelected: boolean, onSelect: (id: number) => void }) => {
  // Simulate expensive work
  const start = performance.now();
  while (performance.now() - start < 1) { /* block for 1ms */ }

  console.log(`Rendering Row ${item.id}`);

  return (
    <tr 
      style={{ background: isSelected ? '#e0f7fa' : 'transparent', cursor: 'pointer' }}
      onClick={() => onSelect(item.id)}
    >
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.category}</td>
      <td>${item.value}</td>
    </tr>
  );
};

const ITEMS = generateItems(200);

export default function DataGrid() {
  const [filter, setFilter] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // TODO: Memoize this filtering logic
  const filteredItems = ITEMS.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  // TODO: Memoize this handler
  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Optimized Data Grid</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Filter by name..." 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <p>Selected ID: {selectedId ?? 'None'}</p>
      </div>

      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <Row 
              key={item.id} 
              item={item} 
              isSelected={item.id === selectedId}
              onSelect={handleSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

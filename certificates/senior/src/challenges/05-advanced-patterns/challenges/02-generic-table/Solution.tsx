// Solution: Generic Data Table
//
// Key points:
// - Generic <T> flows from props through to all Column accessors — fully type-safe
// - Sort state: { columnIndex, direction } — null columnIndex means unsorted
// - Sorted data: [...data].sort() — NEVER mutate original array with .sort()
// - sortKey is optional: columns without it are not sortable
// - onDelete is optional: Actions column only renders when provided

import { useState } from 'react';

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortKey?: (row: T) => string | number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string | number;
  onDelete?: (row: T) => void;
  emptyMessage?: string;
}

interface SortState {
  columnIndex: number | null;
  direction: 'asc' | 'desc';
}

function DataTable<T>({
  data,
  columns,
  getRowId,
  onDelete,
  emptyMessage = 'No data',
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>({ columnIndex: null, direction: 'asc' });

  // Compute sorted data — spread first to avoid mutating the original array
  const sortedData = (() => {
    if (sort.columnIndex === null) return data;
    const col = columns[sort.columnIndex];
    if (!col.sortKey) return data;

    return [...data].sort((a, b) => {
      const av = col.sortKey!(a);
      const bv = col.sortKey!(b);
      if (av < bv) return sort.direction === 'asc' ? -1 : 1;
      if (av > bv) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  })();

  function handleSort(columnIndex: number) {
    const col = columns[columnIndex];
    if (!col.sortKey) return; // non-sortable column

    setSort((prev) => ({
      columnIndex,
      direction:
        prev.columnIndex === columnIndex && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  function getSortIndicator(columnIndex: number) {
    if (sort.columnIndex !== columnIndex) return ' ↕';
    return sort.direction === 'asc' ? ' ▲' : ' ▼';
  }

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr style={{ background: '#f0f0f0' }}>
          {columns.map((col, i) => (
            <th
              key={i}
              onClick={() => handleSort(i)}
              style={{
                padding: '10px',
                textAlign: 'left',
                cursor: col.sortKey ? 'pointer' : 'default',
                borderBottom: '2px solid #ccc',
                userSelect: 'none',
              }}
            >
              {col.header}
              {col.sortKey && (
                <span style={{ fontSize: '0.75em', color: '#666' }}>
                  {getSortIndicator(i)}
                </span>
              )}
            </th>
          ))}
          {onDelete && (
            <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {sortedData.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length + (onDelete ? 1 : 0)}
              style={{ padding: '16px', textAlign: 'center', color: '#999' }}
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          sortedData.map((row) => (
            <tr
              key={getRowId(row)}
              style={{ borderBottom: '1px solid #eee' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#fafafa')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
            >
              {columns.map((col, i) => (
                <td key={i} style={{ padding: '10px' }}>
                  {col.accessor(row)}
                </td>
              ))}
              {onDelete && (
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => onDelete(row)}
                    style={{
                      background: '#cc0000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

// --- Demo ---
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: 'admin' | 'user';
}

const initialUsers: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', age: 32, role: 'admin' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', age: 25, role: 'user' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', age: 41, role: 'user' },
  { id: 4, name: 'David Brown', email: 'david@example.com', age: 28, role: 'admin' },
];

export default function DataTableDemo() {
  const [users, setUsers] = useState(initialUsers);

  const columns: Column<User>[] = [
    { header: 'Name', accessor: (u) => u.name, sortKey: (u) => u.name },
    { header: 'Email', accessor: (u) => u.email },
    { header: 'Age', accessor: (u) => u.age, sortKey: (u) => u.age },
    {
      header: 'Role',
      accessor: (u) => (
        <span style={{ color: u.role === 'admin' ? '#c00' : '#060' }}>{u.role}</span>
      ),
      // No sortKey — not sortable; click does nothing
    },
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h2>Generic DataTable</h2>
      <p>Click sortable column headers (Name, Age) to sort. Delete rows to test empty state.</p>
      <DataTable<User>
        data={users}
        columns={columns}
        getRowId={(u) => u.id}
        onDelete={(u) => setUsers((prev) => prev.filter((x) => x.id !== u.id))}
        emptyMessage="All users deleted!"
      />
    </div>
  );
}

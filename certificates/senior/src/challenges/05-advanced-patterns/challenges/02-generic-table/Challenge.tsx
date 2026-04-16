// Challenge: Generic Data Table
//
// Build a fully generic, reusable <DataTable<T>> component with:
// - Typed columns (header + accessor function)
// - Sortable columns (click to sort asc/desc)
// - Row actions (delete / edit via callbacks)
// - Empty state
//
// TASKS:
// TODO 1: Define Column<T> interface with { header, accessor, sortable? }
// TODO 2: Define DataTableProps<T> with { data, columns, onDelete?, getRowId }
// TODO 3: Implement sort state (columnIndex + direction asc|desc)
// TODO 4: Compute sortedData using [...data].sort() based on active column
// TODO 5: Render <table> with thead/tbody, using column definitions
// TODO 6: Add sort indicators (▲ / ▼) and click handlers on sortable headers
// TODO 7: Show empty state row when data is empty

import { useState } from 'react';

// TODO 1: Column interface
interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode; // can return string | number | JSX
  sortKey?: (row: T) => string | number;  // for sorting (optional)
}

// TODO 2: DataTable props
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string | number;
  onDelete?: (row: T) => void;
  emptyMessage?: string;
}

// TODO 3-7: Implement DataTable
function DataTable<T>({ data, columns, getRowId, onDelete, emptyMessage = 'No data' }: DataTableProps<T>) {
  // TODO 3: State for sort — { columnIndex: number | null; direction: 'asc' | 'desc' }

  // TODO 4: sortedData computation

  // TODO 5-7: render table
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i}>{col.header /* TODO: add sort click + indicator */}</th>
          ))}
          {onDelete && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {/* TODO: map sortedData rows, show empty state if length === 0 */}
        <tr>
          <td>Implement me</td>
        </tr>
      </tbody>
    </table>
  );
}

// --- Demo data ---
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
    },
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h2>Generic DataTable</h2>
      <DataTable<User>
        data={users}
        columns={columns}
        getRowId={(u) => u.id}
        onDelete={(u) => setUsers((prev) => prev.filter((x) => x.id !== u.id))}
      />
    </div>
  );
}

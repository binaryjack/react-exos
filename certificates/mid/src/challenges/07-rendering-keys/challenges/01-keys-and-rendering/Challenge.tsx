/**
 * CHALLENGE — Keys, Rendering Pitfalls & Derived State
 *
 * Three common exam traps in one challenge:
 *
 * PART 1 — Fix the key bug
 *   - A todo list uses array index as key
 *   - Each item has a controlled text input for notes
 *   - Delete the first item — notice the note shifts to the wrong item
 *   - Fix: use item.id as key
 *
 * PART 2 — Fix the 0 && rendering bug
 *   - A counter shows a Spinner when count is 0 — but 0 is rendered as text
 *   - Fix it so nothing renders when count is 0
 *
 * PART 3 — Replace derived state + useEffect with inline computation
 *   - A list of users is filtered by active status
 *   - Currently uses useEffect to sync filtered state — creates bugs on fast updates
 *   - Replace with a direct computation (or useMemo)
 *
 * Key concepts tested:
 * - Why index keys break uncontrolled/controlled inputs on delete/reorder
 * - Falsy values that render in JSX (0, NaN, "") vs those that don't (null, false)
 * - Derived state anti-pattern vs computing during render
 */

import { useEffect, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TodoItem {
  id: number;
  text: string;
}

interface User {
  id: number;
  name: string;
  active: boolean;
}

// ─── PART 1: Key Bug ─────────────────────────────────────────────────────────

const INITIAL_TODOS: TodoItem[] = [
  { id: 1, text: 'Buy groceries' },
  { id: 2, text: 'Write tests' },
  { id: 3, text: 'Read docs' },
];

function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);

  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  return (
    <section>
      <h2>Part 1 — Key Bug</h2>
      <p>Type a note in each input, then delete the first item. Watch the notes shift!</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo, index) => (
          // TODO: change key={index} to key={todo.id}
          <li key={index} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 160 }}>{todo.text}</span>
            {/* uncontrolled input — note value is tied to DOM position (key) */}
            <input placeholder="Add a note..." style={{ flex: 1 }} />
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── PART 2: 0 && rendering bug ───────────────────────────────────────────────

function SpinnerDemo() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <h2>Part 2 — 0 && Bug</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(0)} style={{ marginLeft: 8 }}>Reset to 0</button>
      <div>
        {/* TODO: Fix this — when count is 0, the number 0 is rendered to the DOM */}
        {count && <span style={{ color: 'green' }}>● Items loaded ({count})</span>}
      </div>
    </section>
  );
}

// ─── PART 3: Derived State Anti-Pattern ───────────────────────────────────────

const ALL_USERS: User[] = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Carol', active: true },
  { id: 4, name: 'Dave', active: false },
];

function UserFilterDemo() {
  const [users] = useState<User[]>(ALL_USERS);
  // TODO: Remove filtered state + useEffect entirely.
  // Compute filteredUsers directly: const filteredUsers = users.filter(u => u.active);
  // (Use useMemo if you want to be explicit about memoization)
  const [filtered, setFiltered] = useState<User[]>([]);

  // Anti-pattern: syncing derived state with useEffect
  // Replace this entire block with: const filteredUsers = users.filter(u => u.active);
  useEffect(() => {
    setFiltered(users.filter(u => u.active));
  }, [users]);

  return (
    <section>
      <h2>Part 3 — Derived State</h2>
      <p>Active users only:</p>
      <ul>
        {filtered.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
      <p style={{ color: '#888', fontSize: 12 }}>
        Refactor: remove filtered state and useEffect, compute inline.
      </p>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h1>Keys, Rendering & Derived State</h1>
      <TodoList />
      <hr />
      <SpinnerDemo />
      <hr />
      <UserFilterDemo />
    </div>
  );
}

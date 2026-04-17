/**
 * SOLUTION — Keys, Rendering Pitfalls & Derived State
 */

import { useMemo, useState } from 'react';

interface TodoItem {
  id: number;
  text: string;
}

interface User {
  id: number;
  name: string;
  active: boolean;
}

const INITIAL_TODOS: TodoItem[] = [
  { id: 1, text: 'Buy groceries' },
  { id: 2, text: 'Write tests' },
  { id: 3, text: 'Read docs' },
];

// ─── PART 1: key={todo.id} — stable, identity-based key ───────────────────────

function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);

  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  return (
    <section>
      <h2>Part 1 — Key Fixed ✅</h2>
      <p>Type a note in each input, then delete the first item. Notes stay correct!</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 160 }}>{todo.text}</span>
            <input placeholder="Add a note..." style={{ flex: 1 }} />
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── PART 2: Boolean conversion prevents 0 rendering ─────────────────────────

function SpinnerDemo() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <h2>Part 2 — 0 && Fixed ✅</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(0)} style={{ marginLeft: 8 }}>Reset to 0</button>
      <div>
        {/* FIX: explicit boolean comparison — count > 0 is always a boolean */}
        {count > 0 && <span style={{ color: 'green' }}>● Items loaded ({count})</span>}
      </div>
    </section>
  );
}

// ─── PART 3: Compute derived value during render ───────────────────────────────

const ALL_USERS: User[] = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Carol', active: true },
  { id: 4, name: 'Dave', active: false },
];

function UserFilterDemo() {
  const [users] = useState<User[]>(ALL_USERS);

  // FIX: compute during render — no state, no useEffect, no sync bugs
  const filteredUsers = useMemo(() => users.filter(u => u.active), [users]);

  return (
    <section>
      <h2>Part 3 — Derived State Fixed ✅</h2>
      <p>Active users only:</p>
      <ul>
        {filteredUsers.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h1>Keys, Rendering & Derived State — Solutions</h1>
      <TodoList />
      <hr />
      <SpinnerDemo />
      <hr />
      <UserFilterDemo />
    </div>
  );
}

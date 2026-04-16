# Hooks Deep Dive

Hooks are the backbone of React. The exam tests not just whether you know the API but whether you understand the **mental model** behind each hook.

---

## useState

**What it is:** Local component state. Triggers a re-render when updated.

```tsx
const [count, setCount] = useState(0);
const [count, setCount] = useState(() => expensiveInitialValue()); // lazy initializer
```

**Key rules:**
- State is **snapshot-based** — `setCount(count + 1)` called 3 times in one event = only +1. Use the functional form: `setCount(c => c + 1)`
- State updates are **batched** in React 18+ (even in async handlers)
- Never mutate state directly — always create a new reference

**Exam traps:**
- Stale closures: referencing `count` inside `setTimeout` captures the value at render time
- Object state: `setState({ ...prev, key: value })` — always spread
- Array state: return a new array, never mutate with `.push()`

---

## useEffect

**What it is:** Synchronize a component with an external system (DOM, network, timers).

```tsx
useEffect(() => {
  // setup code
  return () => {
    // cleanup code — runs on unmount and before next effect
  };
}, [dependencies]);
```

**Dependency array rules:**
- `[]` — runs once after mount
- `[a, b]` — runs after mount AND whenever `a` or `b` changes
- No array — runs after every render (rarely intentional)

**Key mental model:** Think of effects as **synchronization**, not lifecycle. The question is: "What external system do I need to be in sync with?"

**Exam traps:**
- Missing dependencies (ESLint exhaustive-deps rule)
- Forgotten cleanup (event listeners, subscriptions, timers)
- Fetching data in `useEffect` without an abort controller (race conditions)
- Don't use `useEffect` for: deriving state, user events, or pure calculations

**Correct data fetching pattern:**
```tsx
useEffect(() => {
  let cancelled = false;
  
  async function fetchData() {
    const data = await fetch('/api/data').then(r => r.json());
    if (!cancelled) setData(data);
  }
  
  fetchData();
  return () => { cancelled = true; };
}, [id]);
```

---

## useRef

**What it is:** A mutable container that persists across renders **without causing re-renders**.

Two main uses:
1. Access DOM elements
2. Store mutable values that don't need to trigger renders (timers, previous values)

```tsx
const inputRef = useRef<HTMLInputElement>(null);
// Access: inputRef.current?.focus()

const timerRef = useRef<number | null>(null);
// timerRef.current = setTimeout(...) — no re-render
```

**Exam traps:**
- `ref.current` is not available during the render phase (only in effects/handlers)
- Don't read/write `ref.current` during rendering
- `useRef` vs `useState`: if the value change should update the UI → use `useState`

---

## useReducer

**What it is:** Alternative to `useState` for complex state logic with multiple sub-values or when the next state depends on the previous.

```tsx
type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset'; payload: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return action.payload;
    default: return state;
  }
}

const [count, dispatch] = useReducer(reducer, 0);
dispatch({ type: 'increment' });
```

**When to use `useReducer` vs `useState`:**
- Multiple related pieces of state → `useReducer`
- Next state depends on previous in complex ways → `useReducer`
- State update logic needs to be testable in isolation → `useReducer`
- Simple toggle or single value → `useState`

---

## useContext

**What it is:** Read a value from the nearest `Context.Provider` above in the tree.

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light');

// Provider (usually at app level)
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// Consumer (anywhere in the tree)
const theme = useContext(ThemeContext);
```

**Key rules:**
- Every component that calls `useContext(MyContext)` will re-render when the context value changes
- Context is not a replacement for all state — it's for **global/shared** values
- Split contexts if some consumers only need part of the value

**Exam traps:**
- Forgetting the Provider — component gets the default value silently
- Creating the context value object inline (new reference every render → causes re-renders)

---

## useMemo

**What it is:** Memoize an **expensive calculation** — only recompute when dependencies change.

```tsx
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

**When to use:**
- Computationally expensive: filtering/sorting large arrays
- When the result is used as a dependency in another hook
- When passing a reference to a memoized child component (with `memo`)

**When NOT to use:**
- For simple calculations — overhead of memoization is worse
- With the React Compiler enabled — it handles this automatically

---

## useCallback

**What it is:** Memoize a **function reference** — the function is only recreated when dependencies change.

```tsx
const handleClick = useCallback((id: string) => {
  removeItem(id);
}, [removeItem]);
```

**When to use:**
- Passing callbacks to memoized child components (`React.memo`)
- Callbacks used as dependencies in `useEffect`

**Key insight:** Without `useCallback`, a new function reference is created every render, breaking `memo` optimization.

---

## Custom Hooks

**What they are:** Functions that start with `use` and can call other hooks. They extract and reuse stateful logic.

```tsx
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

**Rules of custom hooks:**
- Must start with `use`
- Can call other hooks
- Each call = independent isolated state
- Return whatever the consumer needs (value, setter, methods)

---

## Exam Quick Reference

| Hook | Triggers re-render? | Use for |
|------|---------------------|---------|
| `useState` | Yes | UI state |
| `useReducer` | Yes | Complex UI state |
| `useContext` | Yes (when value changes) | Shared state |
| `useRef` | No | DOM refs, mutable values |
| `useMemo` | No (memoizes result) | Expensive calculations |
| `useCallback` | No (memoizes function) | Stable function references |
| `useEffect` | No (side effects only) | External sync |

---

## Challenges

1. [useState — Smart Form](./challenges/01-useState-form/)
2. [useEffect — Data Fetching with Cleanup](./challenges/02-useEffect-data-fetching/)
3. [useRef — Focus Management](./challenges/03-useRef-focus/)
4. [useReducer — Shopping Cart](./challenges/04-useReducer-cart/)
5. [useContext — Theme System](./challenges/05-useContext-theme/)
6. [useMemo + useCallback — List Optimization](./challenges/06-useMemo-useCallback/)
7. [Custom Hook — useLocalStorage](./challenges/07-custom-hooks/)

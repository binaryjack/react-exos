# React Compiler

The React Compiler (previously "React Forget") is a build-time tool that **automatically memoizes** your React components and hooks. Available as a Babel/SWC plugin.

---

## What It Does

The compiler analyzes your code and inserts `useMemo`, `useCallback`, and `React.memo` automatically — everywhere it's safe to do so.

**Before compiler:**
```tsx
function ExpensiveComponent({ items, filter }) {
  // You write this manually:
  const filteredItems = useMemo(
    () => items.filter(i => i.name.includes(filter)),
    [items, filter]
  );
  const handleDelete = useCallback(
    (id) => removeItem(id),
    [removeItem]
  );
  return <List items={filteredItems} onDelete={handleDelete} />;
}
```

**With compiler:**
```tsx
// You write this — compiler handles the rest:
function ExpensiveComponent({ items, filter }) {
  const filteredItems = items.filter(i => i.name.includes(filter));
  const handleDelete = (id) => removeItem(id);
  return <List items={filteredItems} onDelete={handleDelete} />;
}
```

---

## Rules of React (Required for Compiler)

The compiler ONLY works correctly when you follow the Rules of React. Violations disable optimization for that code.

### 1. Components and Hooks Must Be Pure
Same inputs → same output. No side effects during rendering.

```tsx
// ❌ Impure — modifies external state during render
let count = 0;
function Counter() {
  count++; // side effect during render!
  return <div>{count}</div>;
}

// ✅ Pure
function Counter() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

### 2. Hooks Can Only Be Called at the Top Level
No hooks inside conditions, loops, or nested functions.

```tsx
// ❌ Conditional hook
function Component({ showData }) {
  if (showData) {
    const data = useFetch('/api/data'); // ← BREAKS Rules of Hooks
  }
}

// ✅ Always call hooks, conditionally use their value
function Component({ showData }) {
  const data = useFetch('/api/data');
  return showData ? <div>{data}</div> : null;
}
```

### 3. Don't Mutate State Directly
Always return new values.

```tsx
// ❌
function addItem(items, newItem) {
  items.push(newItem); // mutation!
  return items;
}

// ✅
function addItem(items, newItem) {
  return [...items, newItem]; // new reference
}
```

### 4. Props and State Are Read-Only Snapshots
Don't reassign props or state values.

---

## Setting Up React Compiler

```bash
npm install babel-plugin-react-compiler
```

```js
// babel.config.js
module.exports = {
  plugins: [['babel-plugin-react-compiler', {}]],
};
```

**ESLint rules:**
```bash
npm install eslint-plugin-react-compiler
```
The ESLint plugin warns you when your code violates Rules of React (which would prevent compiler optimization).

---

## What You Still Need to Know

Even with the compiler, you need to understand:
- **WHY** memoization works — the compiler applies it, but you need to reason about it
- **The Rules of React** — violations opt code out of compiler optimization
- **When NOT to optimize** — the compiler won't fix architectural problems
- **State structure decisions** — no compiler helps with "where should this state live?"

---

## Exam Tips

- With the compiler: you don't need to write `useMemo`/`useCallback` manually
- But you absolutely must understand what they do — the exam tests mental models
- The compiler requires Pure Functions — impure components are a red flag
- `memo()` is still useful in edge cases even with the compiler
- The compiler integrates with ESLint for rule violations detection

---

## Exercise

Read this component and identify 3 violations of the Rules of React:

```tsx
let globalId = 0;

function BuggyList({ filterFn }) {
  const [items, setItems] = useState([]);

  // Read the bugs in each line
  if (items.length > 0) {
    const filtered = useMemo(() => filterFn(items), [items]); // Bug 1
  }

  items.push({ id: globalId++, name: 'new' }); // Bug 2

  const handleClick = () => {
    items[0].count++; // Bug 3
    setItems(items);
  };

  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}
```

**Bugs:**
1. `useMemo` inside an `if` — conditional hook call
2. `items.push()` during render — mutation + side effect
3. `items[0].count++` then `setItems(items)` — mutating state directly, same reference

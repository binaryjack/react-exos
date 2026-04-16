# Performance Optimization

React re-renders are cheap most of the time. Optimize only when you have a **measured** performance problem. Premature optimization makes code harder to read.

---

## When React Re-renders

A component re-renders when:
1. Its **state** changes (via `setState` or `dispatch`)
2. Its **props** change
3. Its **parent** re-renders (even with same props — unless wrapped in `React.memo`)
4. A **context** value it consumes changes

---

## React.memo

Wraps a component and skips re-rendering if props haven't changed (shallow comparison).

```tsx
const ExpensiveList = React.memo(function ExpensiveList({ items, onDelete }) {
  // Only re-renders when items or onDelete reference changes
});
```

**Key:** `memo` only prevents re-renders due to parent re-renders. State/context changes still trigger re-renders.

---

## Code Splitting & Lazy Loading

Split your bundle so users only download code they need:

```tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

**Route-based splitting** (most common pattern):
```tsx
const HomePage = lazy(() => import('./pages/Home'));
const ProfilePage = lazy(() => import('./pages/Profile'));
```

---

## Key Profiling Tools

- **React DevTools Profiler** — record renders, see which components re-rendered and why
- **why-did-you-render** library — logs unnecessary re-renders to console
- Browser's Performance tab — identify JavaScript bottlenecks

---

## Exam Tips

- Know the difference between `useMemo` (memoizes value) vs `useCallback` (memoizes function)
- `React.memo` needs stable prop references — combine with `useCallback` for function props
- Over-optimizing is an anti-pattern — only memoize when you have proof of a problem
- With **React Compiler** (React 19+): you don't need `useMemo`/`useCallback` manually

---

## Challenges

1. [React.memo + useCallback — Preventing Re-renders](./challenges/01-memo-optimization/)
2. [Lazy Loading — Route-based Code Splitting](./challenges/02-lazy-loading/)

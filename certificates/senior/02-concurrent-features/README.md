# Concurrent Features

React's concurrent features are coordination tools for building smooth, responsive UIs. They don't make your code faster — they make it **feel faster** by prioritizing urgent updates.

---

## The Mental Model: Priority

Concurrent React can work on multiple state updates simultaneously, prioritizing some over others:
- **Urgent:** keystrokes, clicks, direct interactions — must feel instant
- **Non-urgent (transitions):** navigation, search results, data — can yield to urgent work

---

## useTransition

Marks state updates as **non-urgent**. React can interrupt them to handle urgent updates.

```tsx
const [isPending, startTransition] = useTransition();

// Mark this update as non-urgent
function handleTabChange(tab: string) {
  startTransition(() => {
    setActiveTab(tab); // expensive re-render can be interrupted
  });
}
```

**React 19: Async transitions**
```tsx
// startTransition can now wrap async actions
startTransition(async () => {
  await saveData();             // async work
  setData(updatedData);         // state update
  // both are part of the same transition
});
```

**Key facts:**
- `isPending` is true while the transition is in progress
- State updates inside `startTransition` are interruptible
- Useful for expensive renders (tab changes, search results, navigation)

---

## useDeferredValue

Defers a value update so that the UI stays responsive while heavy re-renders happen.

```tsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);

// Input stays responsive (query updates immediately)
// ExpensiveList uses deferredQuery (may lag behind by one render)
<input value={query} onChange={e => setQuery(e.target.value)} />
<ExpensiveList filter={deferredQuery} />
```

**Stale check pattern** — show when content is catching up:
```tsx
const isStale = query !== deferredQuery;
<div style={{ opacity: isStale ? 0.5 : 1 }}>
  <SearchResults query={deferredQuery} />
</div>
```

**useTransition vs useDeferredValue:**
| | `useTransition` | `useDeferredValue` |
|--|--|--|
| Control over | State updates | Values from props/state |
| When to use | You own the setter | Value comes from outside |
| Returns | `[isPending, start]` | Deferred value |

---

## Suspense (Advanced)

In React 18+, Suspense works with data, not just code splitting.

```tsx
// Parallel loading — both requests start at the same time
<div>
  <Suspense fallback={<UserSkeleton />}>
    <UserProfile userId={id} />
  </Suspense>
  <Suspense fallback={<PostsSkeleton />}>
    <UserPosts userId={id} />
  </Suspense>
</div>
```

**Transition + Suspense** — keep showing old content while new loads:
```tsx
const [page, setPage] = useState('home');
const [isPending, startTransition] = useTransition();

function navigate(newPage: string) {
  startTransition(() => setPage(newPage));
}

// Current page stays visible (with reduced opacity) until new page loads
<div style={{ opacity: isPending ? 0.5 : 1 }}>
  <Suspense fallback={<PageSkeleton />}>
    <Page name={page} />
  </Suspense>
</div>
```

Without `startTransition`: clicking a link immediately shows the loading skeleton.
With `startTransition`: the previous page stays visible until the new page is ready.

---

## Exam Tips

- `startTransition` callback must be synchronous (React 19 allows async)
- `useDeferredValue` vs `useTransition`: use the transition if you control the state setter; use deferred value if the value comes from props
- Suspense during transitions: React "waits" to show the fallback — it prefers showing stale content
- Every component inside `<Suspense>` must handle its own data loading

---

## Challenges

1. [useTransition — Tab Navigation](./challenges/01-useTransition/)
2. [useDeferredValue — Search with Stale UI](./challenges/02-useDeferredValue/)
3. [Suspense — Parallel Data Loading](./challenges/03-suspense-parallel/)

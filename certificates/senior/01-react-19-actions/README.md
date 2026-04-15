# React 19 Actions

React 19 introduces a new paradigm for handling async work: **Actions**. This is the most important topic for the Senior exam.

---

## What Are Actions?

Actions are async functions passed to transitions. They handle:
- Pending states automatically
- Error handling (via Error Boundaries)
- Optimistic updates (via `useOptimistic`)
- Sequential requests (queuing)

**Naming convention:** Action functions should be named with "Action" suffix or `handle*` to signal they are transitions.

```tsx
const [isPending, startTransition] = useTransition();

const submitAction = async () => {
  startTransition(async () => {
    await saveData(formData);
    // All state updates inside are batched
  });
};
```

---

## useActionState

Manages state + pending status for async actions. Replaces the `isPending` + `useState` pattern.

```tsx
const [state, dispatchAction, isPending] = useActionState(
  async (prevState: State, formData: FormData) => {
    // return new state
    const result = await saveData(formData);
    return { ...prevState, data: result };
  },
  initialState
);
```

**API breakdown:**
- `state` — current state (updated by the action's return value)
- `dispatchAction` — call to trigger the action
- `isPending` — true while action is running
- The action receives `(previousState, ...args)` — the previous state is always first

**Error handling:**
```tsx
// Expected errors: return as part of state
async function formAction(prev, formData) {
  try {
    await createUser(formData);
    return { success: true, error: null };
  } catch (e) {
    return { success: false, error: e.message }; // ← return, don't throw
  }
}

// Unexpected errors: throw — caught by Error Boundary
async function dangerousAction(prev, formData) {
  const result = await criticalOperation(); // may throw
  return result;
}
```

**Queuing behavior:** If `dispatchAction` is called multiple times quickly, actions queue — each waits for the previous to complete.

---

## useOptimistic

Shows a temporary optimistic value while an async operation is running. Automatically reverts if the operation fails.

```tsx
const [optimisticItems, addOptimisticItem] = useOptimistic(
  items,
  (currentItems, newItem) => [...currentItems, { ...newItem, pending: true }]
);

// Must be called inside a transition
startTransition(async () => {
  addOptimisticItem(newItem);    // ← shows immediately
  await saveItem(newItem);       // ← waits for server
  // when transition ends, optimisticItems settles to real `items`
});
```

**Lifecycle:**
1. Transition starts → optimistic value applied immediately
2. While transition runs → component shows optimistic value
3. Transition ends → optimistic value replaced by real state
4. If error → optimistic value reverts to real state

---

## Form Actions (React 19)

Forms can accept async functions as `action` prop:

```tsx
async function createPostAction(formData: FormData) {
  const title = formData.get('title') as string;
  await createPost({ title });
}

<form action={createPostAction}>
  <input name="title" placeholder="Post title" />
  <button type="submit">Create</button>
</form>
```

React automatically:
- Wraps the action in a transition
- Provides pending state via `useFormStatus()` hook inside the form

```tsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>;
}
```

---

## use() API

`use()` reads a Promise or Context. Unlike hooks — can be called conditionally.

```tsx
// With promises (integrates with Suspense)
const data = use(promise); // suspends until resolved

// With context (alternative to useContext)
const theme = use(ThemeContext);
```

**Key difference from `useContext`:** `use()` can be called inside conditions and loops.

---

## Exam Tips

- `useActionState` action signature: `(prevState, ...userArgs) => newState`
- `useOptimistic` MUST be called inside a transition
- Form actions use `FormData` — not `onSubmit` events
- `use()` with promises REQUIRES a Suspense boundary above
- Errors thrown in actions are caught by Error Boundaries; return expected errors as state

---

## Challenges

1. [useActionState — Async Form](./challenges/01-useActionState/)
2. [useOptimistic — Like Button](./challenges/02-useOptimistic/)
3. [use() API — Suspense Integration](./challenges/03-use-api/)

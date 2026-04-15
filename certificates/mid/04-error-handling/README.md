# Error Handling

React provides two mechanisms for handling errors: **Error Boundaries** and **Suspense fallbacks**.

---

## Error Boundaries

Error boundaries are React components that catch JavaScript errors anywhere in their child component tree and display a fallback UI instead of crashing the whole app.

**Key facts:**
- Must be **class components** (as of React 18 — no hook equivalent yet)
- Catch errors during: rendering, lifecycle methods, and constructors of children
- Do NOT catch: event handlers (use try/catch), async code, server errors

```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to an error reporting service
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

**Usage:**
```tsx
<ErrorBoundary fallback={<ErrorPage />}>
  <RiskyComponent />
</ErrorBoundary>
```

**Placement strategy:**
- Wrap the whole app for a global error screen
- Wrap route sections so one page error doesn't crash navigation
- Wrap individual widgets for graceful degradation

---

## Error Recovery

You can add a "try again" button by resetting the error state:

```tsx
componentDidCatch() { /* log */ }

handleReset = () => this.setState({ hasError: false, error: null });

render() {
  if (this.state.hasError) {
    return (
      <div>
        <p>Something went wrong</p>
        <button onClick={this.handleReset}>Try Again</button>
      </div>
    );
  }
  return this.props.children;
}
```

---

## React Error Boundary Libraries

`react-error-boundary` is the popular library that provides a hook-friendly API:

```tsx
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

// In a child component — can throw to the boundary
const { showBoundary } = useErrorBoundary();

// In event handler (which error boundaries DON'T catch automatically)
async function handleClick() {
  try {
    await riskyOperation();
  } catch (error) {
    showBoundary(error); // manually trigger the boundary
  }
}
```

---

## Exam Tips

- Error boundaries do NOT catch errors in: event handlers, async code (setTimeout, fetch)
- For async errors in event handlers: use `try/catch` + state
- `getDerivedStateFromError` = decide to show fallback
- `componentDidCatch` = side effects (logging)
- React 19 introduces **`useErrorBoundary`** hook as a way to throw to nearest boundary from async code

---

## Challenges

1. [Error Boundary — Widget with Recovery](./challenges/01-error-boundary/)

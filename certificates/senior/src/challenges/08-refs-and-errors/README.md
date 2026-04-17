# Refs (Advanced) & Error Boundary Reset

---

## useImperativeHandle

`forwardRef` exposes the raw DOM node. `useImperativeHandle` lets you expose a **curated API** instead.

```tsx
interface InputHandle {
  focus: () => void;
  validate: () => boolean;
  reset: () => void;
}

const ValidatedInput = forwardRef<InputHandle, Props>(function ValidatedInput(props, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  useImperativeHandle(ref, () => ({
    focus() { inputRef.current?.focus(); },
    validate() {
      if (!value.trim()) { setError('Required'); return false; }
      setError('');
      return true;
    },
    reset() { setValue(''); setError(''); },
  }));

  return <input ref={inputRef} ... />;
});
```

**Rule of thumb:** Prefer props + callbacks. Only use `useImperativeHandle` when you genuinely need imperative control (focus management, animations, complex widget APIs).

---

## Error Boundary Reset

React error boundaries catch render errors. The **reset** pattern uses a key change to remount the subtree fresh.

```tsx
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to observability platform (Sentry, Datadog)
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback({
        error: this.state.error!,
        reset: () => this.setState({ hasError: false, error: null }),
      });
    }
    return this.props.children;
  }
}
```

**The key-reset trick:** Change the `key` of a child to force React to unmount and remount it cleanly — useful for resetting third-party components or complex subtrees.

```tsx
function Parent() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <button onClick={() => { reset(); setResetKey(k => k + 1); }}>
          Retry
        </button>
      )}
    >
      <BuggyWidget key={resetKey} />
    </ErrorBoundary>
  );
}
```

**What error boundaries DO NOT catch:**
- Event handlers (use try/catch)
- Async code (useEffect, setTimeout)
- Server-side rendering
- Errors in the boundary itself

---

## Challenges

→ `challenges/03-useImperativeHandle/` — Build ValidatedInput with custom ref API  
→ `challenges/` in this section — Error boundary with componentDidCatch + reset

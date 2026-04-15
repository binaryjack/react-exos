# Context & State Management

Understanding when to use what state mechanism is one of the most important mid-level skills.

---

## The State Decision Tree

```
Is the state used in only ONE component?
  → useState (or useReducer if logic is complex)

Is the state shared by a few closely-related components?
  → Lift state up to their nearest common ancestor

Is the state needed by many components at different levels?
  → Context API (for app-wide concerns: auth, theme, locale)

Is the state complex with many actions?
  → useReducer (+ optionally Context to share dispatch)
```

---

## Context + useReducer (Redux-lite pattern)

For complex shared state, combine Context with useReducer:

```tsx
// types
type Action = { type: 'LOGIN'; user: User } | { type: 'LOGOUT' };
interface AuthState { user: User | null; isLoggedIn: boolean; }

// reducer
function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'LOGIN': return { user: action.user, isLoggedIn: true };
    case 'LOGOUT': return { user: null, isLoggedIn: false };
    default: return state;
  }
}

// contexts (split for performance — components subscribe to only what they need)
const AuthStateContext = createContext<AuthState | null>(null);
const AuthDispatchContext = createContext<React.Dispatch<Action> | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, isLoggedIn: false });

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}
```

**Why split contexts?** Components that only need to dispatch don't re-render when state changes.

---

## State Lifting

When sibling components need to share state, lift it to the closest common ancestor:

```tsx
// Before: each component has its own filter state (no sharing)
function SearchInput() {
  const [filter, setFilter] = useState('');   // ← local, siblings can't access
}

// After: parent owns the state
function SearchArea() {
  const [filter, setFilter] = useState('');   // ← lifted up

  return (
    <>
      <SearchInput filter={filter} onFilterChange={setFilter} />
      <FilteredResults filter={filter} />
    </>
  );
}
```

---

## Exam Tips

- Context is not a performance solution — every consumer re-renders when value changes
- Split contexts by update frequency: frequent updates → separate context
- `useMemo` the context value to prevent unnecessary re-renders from parent
- Don't use Context for state that changes very frequently (keyboard input, mouse position)
- URL/search params are also "state" — consider them for shareable/bookmarkable state

---

## Challenges

1. [Context + useReducer — Auth System](./challenges/01-auth-context/)

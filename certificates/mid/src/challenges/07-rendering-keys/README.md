# Rendering, Keys & Portals

Correct rendering behaviour separates working code from code that **looks** correct. These topics appear on every React exam.

---

## 1. The `0 &&` Trap

The `&&` operator short-circuits: if the left side is **falsy**, it returns the left value — not `false`.

```tsx
// BUG: renders the number 0 to the DOM
{count && <Spinner />}

// FIX: use boolean conversion
{count > 0 && <Spinner />}
// or
{!!count && <Spinner />}
// or (clearest)
{count > 0 ? <Spinner /> : null}
```

`0`, `NaN`, and `""` are falsy values that **render as text nodes**. `null`, `undefined`, and `false` render nothing.

---

## 2. Keys in Lists

Keys tell React **which item is which** across renders.

| Key choice | Problem |
|---|---|
| Array index | Breaks on insert/delete/reorder — uncontrolled inputs get wrong values |
| `Math.random()` | New key every render — React unmounts/remounts every item |
| Stable `item.id` | ✅ Correct |

**The index-as-key bug:**
```tsx
// Delete index 1 from [A, B, C] → React thinks keys are still 0,1
// DOM node for B is reused for C → uncontrolled input still shows B's value
items.map((item, i) => <Row key={i} item={item} />)  // ❌
items.map(item => <Row key={item.id} item={item} />)  // ✅
```

**Resetting state with a key:**
```tsx
// Changing key unmounts old component, mounts fresh one — instant state reset
<ProfileForm key={userId} userId={userId} />
```

---

## 3. Returning `null`

A component can return `null` to render nothing. This is cleaner than conditional rendering at the call site.

```tsx
function Alert({ message }: { message: string | null }) {
  if (!message) return null;
  return <div role="alert">{message}</div>;
}
```

---

## 4. Derived State — Don't Sync with useEffect

A common mistake: storing derived data in state and syncing it with `useEffect`.

```tsx
// ❌ BAD — derived state + useEffect creates sync bugs
const [items, setItems] = useState(rawItems);
const [filtered, setFiltered] = useState<Item[]>([]);
useEffect(() => setFiltered(items.filter(i => i.active)), [items]);

// ✅ GOOD — compute during render
const filtered = items.filter(i => i.active);
// Need memoization? useMemo instead:
const filtered = useMemo(() => items.filter(i => i.active), [items]);
```

---

## 5. Portals

`createPortal(children, domNode)` renders children **outside** the component's DOM hierarchy while keeping them inside the React tree for context and events.

```tsx
import { createPortal } from 'react-dom';

function Modal({ children }: { children: React.ReactNode }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root')!
  );
}
```

**Why portals:**
- Modals, tooltips, toasts — they need to escape CSS overflow/z-index constraints
- The React tree structure (context, events) is preserved even though the DOM is not

---

## 6. `useId` for Accessibility

`useId()` generates a **stable unique ID** that is consistent between server and client renders.

```tsx
function TextInput({ label }: { label: string }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </>
  );
}
```

**Do NOT use `useId` for list keys** — it is only for accessibility attributes.

---

## Challenges

→ `challenges/01-keys-and-rendering/` — Fix key bugs and rendering pitfalls  
→ `challenges/02-portals-and-useId/` — Implement a Portal-based toast + useId form

# Component Patterns

React patterns solve recurring design problems in a composable, reusable way. The exam tests whether you can recognize which pattern to use and implement it correctly.

---

## Compound Components

**What it is:** A set of components that work together, sharing implicit state through context. The parent component manages state; child components consume it via context.

**Classic example:** `<select>` + `<option>`, `<Tabs>` + `<Tab>` + `<TabPanel>`

```tsx
// Pattern: Parent manages state, children consume via context
const TabsContext = createContext<TabsContextValue | null>(null);

function Tabs({ children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function Tab({ id, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button
      onClick={() => setActiveTab(id)}
      aria-selected={activeTab === id}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }: TabPanelProps) {
  const { activeTab } = useTabsContext();
  return activeTab === id ? <div>{children}</div> : null;
}

// Usage — clean and declarative
<Tabs defaultTab="profile">
  <Tab id="profile">Profile</Tab>
  <Tab id="settings">Settings</Tab>
  <TabPanel id="profile"><ProfileContent /></TabPanel>
  <TabPanel id="settings"><SettingsContent /></TabPanel>
</Tabs>
```

**Exam traps:**
- Forgetting the safety check in the context consumer hook
- Making the context value object unstable (new reference on every render)

---

## Render Props

**What it is:** A prop whose value is a function. The component passes data to this function, letting the caller control what gets rendered.

```tsx
interface MouseTrackerProps {
  render: (pos: { x: number; y: number }) => React.ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  );
}

// Usage — caller controls rendering
<MouseTracker render={({ x, y }) => <span>{x}, {y}</span>} />
```

**Modern alternative:** Custom hooks (preferred since ~React 16.8). Render props still appear in libraries like Formik, Downshift, and React Router.

---

## Higher-Order Components (HOC)

**What it is:** A function that takes a component and returns a new enhanced component. Used for cross-cutting concerns.

```tsx
function withAuth<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { isLoggedIn } = useAuth();
    if (!isLoggedIn) return <Redirect to="/login" />;
    return <WrappedComponent {...props} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);
```

**Key rules:**
- Don't mutate the wrapped component — wrap it
- Forward refs when needed (`React.forwardRef`)
- HOC names should reflect enhancement (`withAuth`, `withLogging`)

**Modern alternative:** Custom hooks (preferred). HOCs still used in class component codebases and some libraries.

---

## Controlled vs Uncontrolled Components

**Controlled:** React state is the single source of truth. Every keystroke calls `onChange` → state update → re-render.

```tsx
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />
```

**Uncontrolled:** DOM is the source of truth. Use `useRef` to access the value when needed.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
<input defaultValue="initial" ref={inputRef} />
// Access: inputRef.current?.value
```

**When to use which:**
| Scenario | Use |
|----------|-----|
| Instant validation | Controlled |
| Conditionally disabling submit | Controlled |
| Dynamically calculated fields | Controlled |
| Simple form, no validation | Uncontrolled |
| Integrating with non-React libraries | Uncontrolled |

**Exam trap:** Mixing controlled and uncontrolled — providing a `value` prop without `onChange` (React warns) or switching from controlled to uncontrolled mid-lifecycle.

---

## forwardRef

Used to expose a child component's DOM ref to the parent.

```tsx
const FancyInput = React.forwardRef<HTMLInputElement, InputProps>(
  function FancyInput({ label, ...props }, ref) {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...props} />
      </div>
    );
  }
);

// Parent can now focus this input
const ref = useRef<HTMLInputElement>(null);
<FancyInput ref={ref} label="Name" />
ref.current?.focus();
```

---

## Challenges

1. [Compound Components — Tabs](./challenges/01-compound-components/)
2. [Render Props — Data Provider](./challenges/02-render-props/)
3. [Controlled vs Uncontrolled](./challenges/03-controlled-uncontrolled/)

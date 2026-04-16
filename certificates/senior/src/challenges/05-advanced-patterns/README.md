# Advanced Patterns (Senior)

Senior-level React patterns: extending compound components, generic reusable components with action props, forwardRef, and the "inversion of control" design philosophy.

---

## 1. Advanced Compound Components

The MID version: static context shared via `React.createContext`.  
The SENIOR version: **fully typed generics**, dynamic slot registration, and context-split for performance.

### Slots Pattern

Instead of hardcoded child types, use `displayName` or `$$typeof` markers to identify slot components:

```tsx
interface TabsProps {
  defaultTab?: string;
  children: React.ReactNode;
}

const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (id: string) => void;
} | null>(null);

function Tabs({ defaultTab = '', children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!;
  return (
    <button
      role="tab"
      aria-selected={ctx.activeTab === id}
      onClick={() => ctx.setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!;
  return ctx.activeTab === id ? <div role="tabpanel">{children}</div> : null;
}

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
```

Usage:
```tsx
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab id="profile">Profile</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="profile"><ProfilePage /></Tabs.Panel>
  <Tabs.Panel id="settings"><SettingsPage /></Tabs.Panel>
</Tabs>
```

---

## 2. Inversion of Control — Action Props

Instead of building all behavior inside a component, expose an **action prop** that lets the parent control state updates. This is the pattern used by `useOptimistic` and libraries like React Table.

```tsx
// Generic list with externally controlled state
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onDeleteAction: (id: number) => void; // "action" naming convention (React 19)
  onAddAction: (item: T) => void;
}

function List<T extends { id: number }>({
  items,
  renderItem,
  onDeleteAction,
}: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {renderItem(item)}
          <button onClick={() => onDeleteAction(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

The parent owns the state and passes down actions — the component becomes a pure view.

---

## 3. Generic Components in TypeScript

Typing generic components properly:

```tsx
// Generic select component
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  getValue: (option: T) => string;
}

function Select<T>({ options, value, onChange, getLabel, getValue }: SelectProps<T>) {
  return (
    <select
      value={getValue(value)}
      onChange={(e) => {
        const found = options.find((o) => getValue(o) === e.target.value);
        if (found) onChange(found);
      }}
    >
      {options.map((option) => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

// Usage
interface Country { code: string; name: string }
<Select<Country>
  options={countries}
  value={selected}
  onChange={setSelected}
  getLabel={(c) => c.name}
  getValue={(c) => c.code}
/>
```

---

## 4. forwardRef

When a parent needs to access a child's DOM node or imperative API:

```tsx
// Expose a DOM ref
const FancyInput = React.forwardRef<HTMLInputElement, { label: string }>(
  ({ label }, ref) => (
    <label>
      {label}
      <input ref={ref} />
    </label>
  )
);

// Expose an imperative API (useImperativeHandle)
interface DialogHandle {
  open: () => void;
  close: () => void;
}

const Dialog = React.forwardRef<DialogHandle, { children: React.ReactNode }>(
  ({ children }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }), []);

    return isOpen ? <div role="dialog">{children}</div> : null;
  }
);

// Usage
const dialogRef = useRef<DialogHandle>(null);
dialogRef.current?.open();
```

**React 19 change:** `forwardRef` will be deprecated in favor of `ref` as a regular prop.

---

## 5. Higher-Order Components (HOCs)

Mostly replaced by hooks, but you'll see them in older codebases:

```tsx
function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthGuard(props: P) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <Component {...props} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);
```

---

## Exam Tips

- Know compound components with TypeScript generic typing
- Understand when `forwardRef` + `useImperativeHandle` is appropriate
- "Inversion of control" = parent controls behavior, component is pure view
- HOCs are legacy pattern — hooks solve the same problems with less boilerplate
- Generic components need explicit type params when TypeScript can't infer them
- React 19: `ref` is now a regular prop for function components (no more `forwardRef`)

---

## Challenges

1. **01-compound-tabs** — Build a `<Tabs>` compound component with TypeScript and ARIA roles
2. **02-generic-table** — Build a generic `<DataTable<T>>` with sortable columns and row actions

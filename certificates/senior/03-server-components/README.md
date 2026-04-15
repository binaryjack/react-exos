# React Server Components

> **Note:** RSC requires a framework (Next.js, Remix). You cannot use them in a plain Vite/CRA project. The coding challenges in the exam will test your knowledge of patterns, not framework setup.

---

## The Core Concept

React Server Components (RSC) run **exclusively on the server**. They:
- Have zero client-side JavaScript cost
- Can directly access databases, file systems, secrets
- Cannot use state, effects, or browser APIs
- Render once on the server; their output is HTML + a serializable description

```tsx
// page.tsx — Server Component (runs on server, no 'use client')
export default async function ProductPage({ params }: { params: { id: string } }) {
  // Direct database access — no API route needed!
  const product = await db.products.findUnique({ where: { id: params.id } });

  return (
    <main>
      <ProductDetails product={product} />  {/* Server Component */}
      <AddToCartButton productId={product.id} />  {/* Client Component */}
    </main>
  );
}
```

---

## Server vs Client Components

| | Server Component | Client Component |
|--|--|--|
| Directive | (none, default in Next.js) | `'use client'` at top |
| Can use state/effects | ❌ | ✅ |
| Can access DB | ✅ | ❌ |
| JavaScript sent to browser | ❌ (zero) | ✅ |
| Can be async | ✅ | ❌ (without useEffect) |
| SEO | ✅ (rendered to HTML) | ❌ (without SSR) |

---

## The Server/Client Boundary

**Rule:** A `'use client'` boundary means: "from here down is client code."

```
AppPage (Server)
├── Header (Server)
│   └── NavLink (Server)
├── ProductGrid (Server) — fetches products
│   └── ProductCard (Server) — displays each product  
│       └── AddToCartButton ('use client') — ← boundary
│           └── Everything inside is client code
└── Footer (Server)
```

**Key pitfall — pushing boundary too high:**
```tsx
// ❌ Don't mark the whole page client just for one button
'use client';
export default function Page() { /* now ALL children are client too */ }

// ✅ Extract just the interactive part
export default function Page() {
  return (
    <div>
      <ExpensiveServerContent />  {/* stays server */}
      <InteractiveButton />       {/* mark THIS as client */}
    </div>
  );
}
```

---

## Children Pattern (Composing Server + Client)

Client Components **cannot import** Server Components. But they CAN receive them as children!

```tsx
// accordion.tsx ('use client')
'use client';
export function Accordion({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

// page.tsx (Server Component)
import { Accordion } from './accordion';
import { ServerContent } from './server-content'; // Server Component

export default async function Page() {
  const data = await fetchData(); // can do this because we're on the server
  return (
    <Accordion>
      <ServerContent data={data} />  {/* Server component passed as children! */}
    </Accordion>
  );
}
```

---

## Serialization Rules

Props crossing the server → client boundary MUST be serializable:

✅ **Can pass:** strings, numbers, booleans, arrays, plain objects, Date, Server Functions (Server Actions)

❌ **Cannot pass:** functions (except Server Actions), class instances, Symbols, closures

```tsx
// ❌ Can't pass a plain function as prop
<ClientButton onClick={() => doSomething()} />

// ✅ Client component defines its own handler; server passes data
<ClientButton productId={product.id} />
// Inside ClientButton: const handleClick = () => doSomething(productId);
```

---

## Data Fetching Patterns

**Waterfall (avoid):**
```tsx
const user = await getUser();           // 200ms
const posts = await getPostsByUser(user.id); // 300ms — waits for user!
// Total: 500ms
```

**Parallel (prefer):**
```tsx
const [user, posts] = await Promise.all([getUser(), getAllPosts()]);
// Total: max(200, 300) = 300ms
```

---

## Exam Tips

- RSC = zero bundle size; they don't add JS to the client
- `'use client'` marks a boundary; everything a client component **imports** is client code
- Children passed as props CAN be server components (they're not imported by the client component)
- Server Functions (`'use server'`) are the mechanism for client → server calls (mutations)
- `server-only` package prevents accidental server code from being bundled in client
- Server Components do NOT re-render on state changes — use `router.refresh()` for updates

---

## Conceptual Exercise

Study the patterns below and answer: which components should be server vs client?

```
Dashboard
├── Sidebar (static nav links)
├── StatsPanel (fetches from DB, only displays numbers)  
├── ActivityChart (uses canvas, needs interactivity)
├── NotificationBell (real-time, uses WebSocket)
└── QuickActions (buttons that trigger server mutations)
```

**Answer:**
- Sidebar → Server (static)
- StatsPanel → Server (DB access, display only)
- ActivityChart → Client (canvas, interactivity)
- NotificationBell → Client (WebSocket, real-time)
- QuickActions → Client (event handlers) + Server Actions for the mutations

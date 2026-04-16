# Accessibility (a11y) for React (Senior)

Accessibility is a first-class concern in the React certification. You must understand ARIA, keyboard navigation, focus management, and screen reader patterns.

---

## Core Concepts

### The Accessibility Tree

Browsers expose an **accessibility tree** (parallel to the DOM) that screen readers use. React renders HTML → browser builds a11y tree → screen readers traverse it.

Always prefer **semantic HTML** — it creates correct a11y tree entries automatically:

```tsx
// ❌ div soup — no semantics
<div onClick={handleSubmit}>Submit</div>

// ✅ semantic HTML — keyboard + screen reader native support
<button type="submit">Submit</button>
```

---

## ARIA Attributes

ARIA (Accessible Rich Internet Applications) supplements HTML semantics.

### Key ARIA attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `role` | Override or define element semantics | `role="dialog"` |
| `aria-label` | Accessible name when text label isn't visible | `aria-label="Close"` |
| `aria-labelledby` | References another element as the label | `aria-labelledby="dialog-title"` |
| `aria-describedby` | References a description element | `aria-describedby="error-msg"` |
| `aria-hidden` | Hides from a11y tree | `aria-hidden="true"` |
| `aria-live` | Announces dynamic changes | `aria-live="polite"` |
| `aria-expanded` | State of expandable widgets | `aria-expanded={isOpen}` |
| `aria-disabled` | Disabled state | `aria-disabled={isDisabled}` |
| `aria-invalid` | Form field error state | `aria-invalid={hasError}` |
| `aria-required` | Required field | `aria-required="true"` |
| `aria-selected` | Selected state (tabs, listbox) | `aria-selected={isActive}` |
| `aria-controls` | References controlled element | `aria-controls="panel-id"` |

### `aria-live` regions

For dynamic updates that aren't caused by user focus:

```tsx
// Announces to screen readers when content changes
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// "assertive" interrupts immediately (use sparingly — errors, alerts)
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

---

## Focus Management

### Focus trap in modals

When a modal opens, focus must:
1. Move INTO the modal
2. Be TRAPPED inside (Tab cycles within modal)
3. Return to the trigger element when modal closes

```tsx
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null); // ref to the element that opened modal

  // Trap focus
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    // Move focus in on open
    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Restore focus on close
  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

---

## Keyboard Navigation Patterns

### Roving tabindex

For groups of related interactive elements (tabs, radio buttons, toolbar), use roving tabindex:

```tsx
// Only ONE element in the group has tabindex="0" at a time
// The rest have tabindex="-1"
// Arrow keys move focus between items

items.map((item, i) => (
  <button
    key={item.id}
    tabIndex={i === activeIndex ? 0 : -1}
    onKeyDown={(e) => {
      if (e.key === 'ArrowRight') setActiveIndex((i + 1) % items.length);
      if (e.key === 'ArrowLeft') setActiveIndex((i - 1 + items.length) % items.length);
    }}
  >
    {item.label}
  </button>
))
```

---

## Accessible Forms

```tsx
// ❌ No label association
<input type="email" placeholder="Email" />

// ✅ Explicit label + aria-invalid + aria-describedby
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <span id="email-error" role="alert">
      {errors.email}
    </span>
  )}
</div>
```

---

## Color & Motion

- Don't rely on color alone to convey information — add icons or text labels
- Respect `prefers-reduced-motion` media query:

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Or in CSS:
// @media (prefers-reduced-motion: reduce) { .animated { animation: none; } }
```

---

## Exam Tips

- **First rule of ARIA**: If native HTML can do it, use HTML — not ARIA
- Know `aria-label` vs `aria-labelledby` vs `aria-describedby`
- Modal = `role="dialog"` + `aria-modal="true"` + focus trap + Escape key
- Skip links: `<a href="#main-content" className="sr-only">Skip to main content</a>`
- `aria-live="polite"` for status, `role="alert"` for errors
- `tabIndex={-1}` = programmatically focusable but not in tab order
- `tabIndex={0}` = in natural tab order
- `tabIndex={1+}` is an anti-pattern — avoid it

---

## Challenges

1. **01-accessible-modal** — Build a fully accessible modal with focus trap, Escape, ARIA, and focus restore
2. **02-accessible-form** — Build a form with proper labels, error announcements, and live regions

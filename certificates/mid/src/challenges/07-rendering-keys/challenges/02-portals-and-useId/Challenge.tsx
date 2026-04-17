/**
 * CHALLENGE — Portals & useId
 *
 * PART 1 — Toast Notification with createPortal
 *   - Build a ToastContainer that renders outside the React root via createPortal
 *   - The toast should appear at the bottom-right of the viewport (fixed position)
 *   - Even though the portal DOM node is outside #root, events and context work normally
 *   - Steps:
 *     1. Create a `portal-root` div and append it to document.body in useEffect
 *     2. Use createPortal to render the toast into that div
 *     3. The toast auto-dismisses after 3 seconds (useEffect + setTimeout)
 *
 * PART 2 — Accessible Form with useId
 *   - Build a reusable TextInput component
 *   - Each input must have a <label> linked via htmlFor / id
 *   - Use useId() to generate unique, SSR-stable IDs — do NOT use Math.random()
 *   - Add a second TextInput on the same page and verify both have unique IDs
 *
 * Key concepts tested:
 * - createPortal: escaping DOM hierarchy while staying in React tree
 * - Why portals are needed (z-index / overflow: hidden constraints)
 * - useId: stable unique IDs for accessibility
 * - useId vs list keys (useId is NOT for keys)
 */

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ─── PART 1: Toast Portal ─────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

// TODO 1: Implement Toast component
// - Renders into a portal (document.body child div)
// - Fixed position bottom-right, z-index: 9999
// - Auto-dismisses after 3000ms (cleanup the timeout!)
function Toast({ message, onDismiss }: ToastProps) {
  const portalRef = useRef<HTMLDivElement | null>(null);

  // TODO: create a div, append to body in useEffect (cleanup: remove from body)
  // TODO: auto-dismiss after 3s

  // TODO: return createPortal(<div style={...}>{message} <button>✕</button></div>, portalRef.current!)
  // For now (placeholder):
  return <div>{message}</div>;
}

function ToastDemo() {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const nextId = useRef(0);

  function addToast(msg: string) {
    const id = nextId.current++;
    setToasts(prev => [...prev, { id, message: msg }]);
  }

  function removeToast(id: number) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  return (
    <section>
      <h2>Part 1 — Toast Portal</h2>
      <button onClick={() => addToast(`Toast at ${new Date().toLocaleTimeString()}`)}>
        Show Toast
      </button>
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} onDismiss={() => removeToast(t.id)} />
      ))}
    </section>
  );
}

// ─── PART 2: Accessible TextInput with useId ─────────────────────────────────

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

// TODO 2: Implement TextInput
// - Call useId() inside the component
// - Use it for: id on <input>, htmlFor on <label>, aria-describedby on <input> (for hint)
// - DO NOT pass id as a prop — generate it internally with useId()
function TextInput({ label, value, onChange, hint }: TextInputProps) {
  // const id = useId();
  // const hintId = `${id}-hint`;

  return (
    <div style={{ marginBottom: 12 }}>
      {/* TODO: <label htmlFor={id}>{label}</label> */}
      <label>{label}</label>
      {/* TODO: add id={id} and aria-describedby={hint ? hintId : undefined} */}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ display: 'block', marginTop: 4 }}
      />
      {hint && (
        // TODO: add id={hintId}
        <span style={{ fontSize: 12, color: '#888' }}>{hint}</span>
      )}
    </div>
  );
}

function AccessibleFormDemo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <section>
      <h2>Part 2 — Accessible Form with useId</h2>
      <p>Inspect the DOM — each label should be linked to its input via matching id/htmlFor.</p>
      <form onSubmit={e => e.preventDefault()}>
        <TextInput
          label="Full Name"
          value={name}
          onChange={setName}
          hint="As it appears on your ID"
        />
        <TextInput
          label="Email Address"
          value={email}
          onChange={setEmail}
        />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h1>Portals & useId</h1>
      <ToastDemo />
      <hr />
      <AccessibleFormDemo />
    </div>
  );
}

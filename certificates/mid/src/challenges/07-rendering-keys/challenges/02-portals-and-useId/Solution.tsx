/**
 * SOLUTION — Portals & useId
 */

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ─── PART 1: Toast Portal ─────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

function Toast({ message, onDismiss }: ToastProps) {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [, forceRender] = useState(0);

  // Create portal root once, append to body
  useEffect(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    portalRef.current = el;
    forceRender(n => n + 1); // trigger re-render after ref is set
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!portalRef.current) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: '#1e293b',
        color: '#f8fafc',
        padding: '12px 16px',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      {message}
      <button
        onClick={onDismiss}
        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 16 }}
      >
        ✕
      </button>
    </div>,
    portalRef.current
  );
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
      <h2>Part 1 — Toast Portal ✅</h2>
      <p>Toasts render into a portal outside #root but still receive React context/events.</p>
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

function TextInput({ label, value, onChange, hint }: TextInputProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={id} style={{ display: 'block', fontWeight: 600 }}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-describedby={hint ? hintId : undefined}
        style={{ display: 'block', marginTop: 4, padding: '4px 8px' }}
      />
      {hint && (
        <span id={hintId} style={{ fontSize: 12, color: '#888' }}>
          {hint}
        </span>
      )}
    </div>
  );
}

function AccessibleFormDemo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <section>
      <h2>Part 2 — Accessible Form ✅</h2>
      <p>Inspect the DOM — each label is linked via useId-generated IDs.</p>
      <form onSubmit={e => e.preventDefault()}>
        <TextInput label="Full Name" value={name} onChange={setName} hint="As it appears on your ID" />
        <TextInput label="Email Address" value={email} onChange={setEmail} />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h1>Portals & useId — Solutions</h1>
      <ToastDemo />
      <hr />
      <AccessibleFormDemo />
    </div>
  );
}

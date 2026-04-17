/**
 * CHALLENGE — useImperativeHandle: Custom Ref API
 *
 * `useImperativeHandle` lets a child component control what the parent sees
 * when it holds a ref to the child. Instead of exposing the raw DOM node,
 * you expose a curated API object.
 *
 * When to use:
 * - You want to expose imperative methods (focus, scroll, open, reset)
 * - You DON'T want to expose the DOM node directly (encapsulation)
 * - You're building a library component with a ref-based API
 *
 * TASK: Build a ValidatedInput component with a custom ref handle
 *
 * The parent should be able to call:
 *   inputRef.current.focus()     → focuses the underlying input
 *   inputRef.current.validate()  → runs validation, returns true/false, shows error UI
 *   inputRef.current.reset()     → clears value and error state
 *
 * Steps:
 * 1. Define ValidatedInputHandle interface with { focus, validate, reset }
 * 2. Define ValidatedInputProps with { label, required?, minLength? }
 * 3. Implement ValidatedInput using forwardRef<ValidatedInputHandle, ValidatedInputProps>
 *    - Use useImperativeHandle to expose focus/validate/reset
 *    - Internal ref points to the <input> DOM node (use a separate useRef)
 * 4. In the parent form, hold a ref to ValidatedInput
 *    - "Submit" button calls validate() on all fields before proceeding
 *    - "Reset" button calls reset() on all fields
 *
 * Key concepts tested:
 * - forwardRef + useImperativeHandle pattern
 * - Difference between ref forwarding (expose DOM) vs useImperativeHandle (expose API)
 * - TypeScript typing: RefObject<Handle>, forwardRef<Handle, Props>
 */

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

// TODO 1: Define the handle interface
interface ValidatedInputHandle {
  focus: () => void;
  validate: () => boolean;
  reset: () => void;
}

interface ValidatedInputProps {
  label: string;
  required?: boolean;
  minLength?: number;
}

// TODO 2: Implement with forwardRef
// const ValidatedInput = forwardRef<ValidatedInputHandle, ValidatedInputProps>(
//   function ValidatedInput({ label, required, minLength }, ref) {
//     const inputRef = useRef<HTMLInputElement>(null);
//     const [value, setValue] = useState('');
//     const [error, setError] = useState('');
//
//     useImperativeHandle(ref, () => ({
//       focus() { inputRef.current?.focus(); },
//       validate() {
//         if (required && !value.trim()) { setError('Required'); return false; }
//         if (minLength && value.length < minLength) { setError(`Min ${minLength} chars`); return false; }
//         setError('');
//         return true;
//       },
//       reset() { setValue(''); setError(''); },
//     }));
//
//     return (
//       <div style={{ marginBottom: 12 }}>
//         <label>{label}</label>
//         <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)} />
//         {error && <span style={{ color: 'red', fontSize: 12 }}>{error}</span>}
//       </div>
//     );
//   }
// );

// Placeholder until implemented
const ValidatedInput = forwardRef<ValidatedInputHandle, ValidatedInputProps>(
  function ValidatedInput({ label }, _ref) {
    return <div><label>{label}: </label><input /></div>;
  }
);

// ─── Parent Form ──────────────────────────────────────────────────────────────

export default function SignupForm() {
  // TODO 3: Create refs for each field
  const nameRef = useRef<ValidatedInputHandle>(null);
  const emailRef = useRef<ValidatedInputHandle>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO 4: validate all fields — only proceed if all return true
    const valid = true; // replace with: nameRef.current?.validate() && emailRef.current?.validate()
    if (valid) setSubmitted(true);
  }

  function handleReset() {
    // TODO 5: call reset() on all fields
    setSubmitted(false);
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 400 }}>
      <h1>useImperativeHandle Challenge</h1>
      {submitted && (
        <div style={{ background: '#dcfce7', padding: 12, borderRadius: 6, marginBottom: 16 }}>
          ✅ Form submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <ValidatedInput ref={nameRef} label="Full Name" required minLength={2} />
        <ValidatedInput ref={emailRef} label="Email" required />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
}

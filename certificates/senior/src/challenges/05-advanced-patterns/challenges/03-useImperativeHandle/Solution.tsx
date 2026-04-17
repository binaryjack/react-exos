/**
 * SOLUTION — useImperativeHandle: Custom Ref API
 */

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

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

const ValidatedInput = forwardRef<ValidatedInputHandle, ValidatedInputProps>(
  function ValidatedInput({ label, required, minLength }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
      validate() {
        if (required && !value.trim()) {
          setError('This field is required');
          return false;
        }
        if (minLength && value.trim().length < minLength) {
          setError(`Minimum ${minLength} characters required`);
          return false;
        }
        setError('');
        return true;
      },
      reset() {
        setValue('');
        setError('');
      },
    }));

    return (
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </label>
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: '6px 10px',
            border: error ? '1px solid red' : '1px solid #ccc',
            borderRadius: 4,
            boxSizing: 'border-box',
          }}
        />
        {error && (
          <span style={{ color: 'red', fontSize: 12, marginTop: 4, display: 'block' }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default function SignupForm() {
  const nameRef = useRef<ValidatedInputHandle>(null);
  const emailRef = useRef<ValidatedInputHandle>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // validate returns false and shows errors inline — check both so all errors show
    const nameValid = nameRef.current?.validate() ?? false;
    const emailValid = emailRef.current?.validate() ?? false;
    if (nameValid && emailValid) {
      setSubmitted(true);
    } else {
      // Focus the first invalid field
      if (!nameValid) nameRef.current?.focus();
      else if (!emailValid) emailRef.current?.focus();
    }
  }

  function handleReset() {
    nameRef.current?.reset();
    emailRef.current?.reset();
    setSubmitted(false);
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 400 }}>
      <h1>useImperativeHandle ✅</h1>
      <p style={{ fontSize: 14, color: '#555' }}>
        The parent calls <code>validate()</code> and <code>reset()</code> on child refs without accessing DOM directly.
      </p>
      {submitted && (
        <div style={{ background: '#dcfce7', padding: 12, borderRadius: 6, marginBottom: 16 }}>
          ✅ Form submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <ValidatedInput ref={nameRef} label="Full Name" required minLength={2} />
        <ValidatedInput ref={emailRef} label="Email" required />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" style={{ padding: '8px 16px' }}>Submit</button>
          <button type="button" onClick={handleReset} style={{ padding: '8px 16px' }}>Reset</button>
        </div>
      </form>
    </div>
  );
}

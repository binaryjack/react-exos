/**
 * SOLUTION — Controlled Form: Contact Form with Validation
 */

import { useState } from 'react';

interface FormValues {
  name: string;
  email: string;
  message: string;
}

interface TouchedState {
  name: boolean;
  email: boolean;
  message: boolean;
}

const INITIAL_VALUES: FormValues = { name: '', email: '', message: '' };
const INITIAL_TOUCHED: TouchedState = { name: false, email: false, message: false };

function validateForm(values: FormValues): Record<keyof FormValues, string> {
  return {
    name: values.name.trim() ? '' : 'Name is required',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
      ? ''
      : 'Valid email is required',
    message: values.message.trim().length >= 20
      ? ''
      : `Message must be at least 20 characters (${values.message.length}/20)`,
  };
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<TouchedState>(INITIAL_TOUCHED);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }

  const errors = validateForm(values);
  const isValid = Object.values(errors).every(e => e === '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mark all fields as touched to show all errors
    setTouched({ name: true, email: true, message: true });
    if (!isValid) return;

    console.log('Submitting:', values);
    setSubmitted(true);
    setValues(INITIAL_VALUES);
    setTouched(INITIAL_TOUCHED);
  }

  if (submitted) {
    return (
      <div>
        <p style={{ color: 'green' }}>Message sent successfully!</p>
        <button onClick={() => setSubmitted(false)}>Send Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.name && errors.name && (
          <small style={{ color: 'red' }}>{errors.name}</small>
        )}
      </div>

      <div>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && (
          <small style={{ color: 'red' }}>{errors.email}</small>
        )}
      </div>

      <div>
        <label htmlFor="message">Message * (min 20 chars)</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.message && errors.message && (
          <small style={{ color: 'red' }}>{errors.message}</small>
        )}
      </div>

      <button type="submit" disabled={!isValid && Object.values(touched).some(Boolean)}>
        Send Message
      </button>
    </form>
  );
}

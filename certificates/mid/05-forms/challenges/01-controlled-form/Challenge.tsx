/**
 * CHALLENGE — Controlled Form: Contact Form with Validation
 *
 * Build a contact form with:
 * - Fields: name (required), email (required, valid email), message (required, min 20 chars)
 * - Validation happens on blur (when user leaves a field)
 * - Errors show only for fields that have been touched (visited)
 * - Submit button disabled until all fields are valid
 * - On submit: show success message, reset form
 *
 * Key concepts tested:
 * - Controlled inputs with generic handleChange
 * - Touched state for UX (don't show errors before user interacts)
 * - Derived validation (errors computed from state, not stored)
 * - Form reset pattern
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

// TODO 1: Implement validateForm — returns an object with error messages
// Return empty strings for valid fields
function validateForm(values: FormValues): Record<keyof FormValues, string> {
  return { name: '', email: '', message: '' }; // TODO
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<TouchedState>(INITIAL_TOUCHED);
  const [submitted, setSubmitted] = useState(false);

  // TODO 2: Implement handleChange (works for all fields via name attribute)

  // TODO 3: Implement handleBlur (marks field as touched)

  // TODO 4: Derive errors using validateForm
  // TODO 5: Derive isValid (no errors in any field)

  // TODO 6: Implement handleSubmit

  if (submitted) {
    return (
      <div>
        <p>Message sent successfully!</p>
        <button onClick={() => { setSubmitted(false); }}>Send Another</button>
      </div>
    );
  }

  return (
    <form /* TODO: onSubmit */>
      <div>
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          // TODO: value, onChange, onBlur
        />
        {/* TODO: show error if touched.name && errors.name */}
      </div>

      <div>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          // TODO: value, onChange, onBlur
        />
        {/* TODO: show error */}
      </div>

      <div>
        <label htmlFor="message">Message * (min 20 chars)</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          // TODO: value, onChange (cast to HTMLTextAreaElement), onBlur
        />
        {/* TODO: show error and char count */}
      </div>

      <button type="submit" /* TODO: disabled={!isValid} */>
        Send Message
      </button>
    </form>
  );
}

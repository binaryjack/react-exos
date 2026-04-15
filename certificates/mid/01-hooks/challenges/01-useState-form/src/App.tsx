/**
 * CHALLENGE 01 — useState: Smart Form
 *
 * Build a registration form with the following requirements:
 * 1. Fields: name, email, password, confirmPassword
 * 2. Show a character count under the name field (max 50 chars)
 * 3. Show a password strength indicator ("weak" | "medium" | "strong")
 *    - weak: < 6 chars
 *    - medium: 6-10 chars
 *    - strong: > 10 chars
 * 4. Disable the submit button if passwords don't match
 * 5. On submit, log the form data and reset the form
 *
 * Key concepts tested:
 * - Object state (correct spreading)
 * - Functional updates
 * - Derived values (computed from state, NOT stored in state)
 */

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_STATE: FormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

// TODO 1: Define a function `getPasswordStrength` that takes a password string
// and returns 'weak' | 'medium' | 'strong' based on the rules above.

// TODO 2: Complete the component below
export default function RegistrationForm() {
  // TODO 3: Initialize form state using useState with INITIAL_STATE

  // TODO 4: Create a handleChange function that updates the correct field
  // using the input's name attribute. Must use functional update (prev => ...)

  // TODO 5: Derive (don't store in state):
  //   - passwordStrength from formData.password
  //   - passwordsMatch boolean
  //   - isSubmitDisabled boolean (passwords don't match OR empty required fields)

  // TODO 6: Create handleSubmit that logs the data and resets form to INITIAL_STATE

  return (
    <form /* TODO 7: attach onSubmit */>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength={50}
          // TODO 8: attach value and onChange
        />
        {/* TODO 9: Show character count like "X / 50" */}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" /* TODO: value, onChange */ />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" /* TODO: value, onChange */ />
        {/* TODO 10: Show password strength label */}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          // TODO: value, onChange
        />
        {/* TODO 11: Show "Passwords do not match" warning when relevant */}
      </div>

      <button type="submit" /* TODO 12: disabled when isSubmitDisabled */>
        Register
      </button>
    </form>
  );
}

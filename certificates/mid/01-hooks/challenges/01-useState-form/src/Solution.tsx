/**
 * SOLUTION 01 — useState: Smart Form
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

function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length > 10) return 'strong';
  if (password.length >= 6) return 'medium';
  return 'weak';
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_STATE);

  // IMPORTANT: use functional update to avoid stale state
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // Derived values — NOT stored in state
  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.password === formData.confirmPassword;
  const isSubmitDisabled =
    !passwordsMatch ||
    !formData.name ||
    !formData.email ||
    !formData.password;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Submitted:', formData);
    setFormData(INITIAL_STATE); // reset
  }

  const strengthColors = { weak: 'red', medium: 'orange', strong: 'green' };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength={50}
          value={formData.name}
          onChange={handleChange}
        />
        <small>{formData.name.length} / 50</small>
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        {formData.password && (
          <small style={{ color: strengthColors[passwordStrength] }}>
            Strength: {passwordStrength}
          </small>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {formData.confirmPassword && !passwordsMatch && (
          <small style={{ color: 'red' }}>Passwords do not match</small>
        )}
      </div>

      <button type="submit" disabled={isSubmitDisabled}>
        Register
      </button>
    </form>
  );
}

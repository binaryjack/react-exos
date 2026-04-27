import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Implement loginAction to simulate a server call.
 * 2. Use useActionState to handle the form submission.
 * 3. Implement SubmitButton using useFormStatus to display pending state.
 * 4. Display the result or error message from the action state.
 */

// Mock Server Action
async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  await new Promise(res => setTimeout(res, 2000));

  if (password === 'password123') {
    return { success: true, message: `Welcome back, ${email}!` };
  } else {
    return { success: false, error: 'Invalid credentials. Hint: password123' };
  }
}

function SubmitButton() {
  // TODO: Use useFormStatus to get the pending state
  const pending = false; // Replace with hook call

  return (
    <button type="submit" disabled={pending} style={{ padding: '10px', marginTop: '10px' }}>
      {pending ? 'Logging in...' : 'Login'}
    </button>
  );
}

export default function LoginForm() {
  // TODO: Use useActionState with loginAction
  const [state, formAction] = [null, (data: FormData) => {}]; // Replace with useActionState

  return (
    <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto', border: '1px solid #ccc' }}>
      <h1>Login (React 19)</h1>
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column' }}>
        <label>Email:</label>
        <input type="email" name="email" required />
        
        <label style={{ marginTop: '10px' }}>Password:</label>
        <input type="password" name="password" required />

        <SubmitButton />

        {/* TODO: Show messages from state */}
        {/* {state?.error && <p style={{ color: 'red' }}>{state.error}</p>} */}
        {/* {state?.success && <p style={{ color: 'green' }}>{state.message}</p>} */}
      </form>
    </div>
  );
}

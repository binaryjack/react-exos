import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const emailError = email.includes('@') ? '' : 'email is not valid';
  const passwordError = password.length >= 6 ? '' : 'password is not valid';
  const isValid =
    email && password && passwordError === '' && emailError === '';

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log('submit value', { email: email, password: password });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.currentTarget.value)
          }
        />
      </div>
      <div>{!email ? '' : emailError}</div>
      <div>
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.currentTarget.value)
          }
        />
      </div>
      <div>{!password ? '' : passwordError}</div>
      <button disabled={!isValid}>Login</button>
    </form>
  );
}

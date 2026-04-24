import { useState } from 'react';
interface Error {
  id: string;
  text: string;
}

enum fieldNamesEnum {
  EMAIL = 'email',
  PASSWORD = 'password',
}

export function SignupForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Error[]>([]);

  const handleErrors = (id: string, text: string) => {
    const currentErrors = [
      ...errors.filter((o) => o.id !== id),
      { id: id, text: text },
    ];
    setErrors(currentErrors);
  };

  const clearErrors = (id?: string) => {
    if (id) {
      const currentErrors = [...errors.filter((o) => o.id !== id)];
      setErrors(currentErrors);
      return;
    }
    setErrors([]);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setEmail(val);
    if (!val.includes('@')) {
      handleErrors(fieldNamesEnum.EMAIL, 'invalid email');
    } else {
      clearErrors();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;

    setPassword(val);

    if (val.length < 6) {
      handleErrors('password', 'password must contains at least 6 chars.');
    }
  };

  return (
    <form>
      <input placeholder="Email" value={email} onChange={handleEmailChange} />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button>Submit</button>
    </form>
  );
}

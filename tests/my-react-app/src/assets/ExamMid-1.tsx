///--------------------EXERCICE 1----------------------
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

  const errorManager = (isTruthy: () => boolean, id: string, text: string) => {
    if (!isTruthy()) {
      handleErrors(id, text);
    } else {
      clearErrors(id);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setEmail(val);
    errorManager(
      () => val.includes('@'),
      fieldNamesEnum.EMAIL,
      'invalid email'
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setPassword(val);
    errorManager(
      () => !(val.length < 6),
      fieldNamesEnum.PASSWORD,
      'password must contains at least 6 chars.'
    );
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('submit data', {
      email: email,
      password: password,
    });
  };

  const emailError = errors.find((o) => o.id === fieldNamesEnum.EMAIL);
  const passwordError = errors.find((o) => o.id === fieldNamesEnum.PASSWORD);
  const canSubmit =
    emailError || passwordError || !email || !password ? false : true;
  return (
    <form>
      <div>
        <div>
          <input
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <div>{emailError && <>{emailError.text}</>}</div>
      </div>

      <div>
        <div>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        <div>{passwordError && <>{passwordError.text}</>}</div>
      </div>
      <div>
        <button disabled={!canSubmit} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </form>
  );
}

# Forms

React forms come in two flavors. Knowing when to use each and the traps of each approach is heavily tested.

---

## Controlled Forms (Most Common)

React state is the single source of truth. Every keystroke → onChange → setState → re-render.

```tsx
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // form values are always up to date in state
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" type="email" value={form.email} onChange={handleChange} />
      <textarea name="message" value={form.message} onChange={handleChange} />
      <button type="submit">Send</button>
    </form>
  );
}
```

---

## Uncontrolled Forms

DOM is the source of truth. Access values via refs at submission time.

```tsx
function UncontrolledSignup() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({
      name: nameRef.current?.value,
      email: emailRef.current?.value,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} name="name" defaultValue="" />
      <input ref={emailRef} name="email" type="email" defaultValue="" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

---

## React 19 — Form Actions

React 19 adds native async form handling:

```tsx
async function createUserAction(formData: FormData) {
  'use server'; // or call API
  const name = formData.get('name') as string;
  await createUser({ name });
}

// Form action (async function) is called automatically on submit
<form action={createUserAction}>
  <input name="name" />
  <button type="submit">Create</button>
</form>
```

---

## Validation Patterns

**On submit** (simple):
```tsx
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  const errors: Record<string, string> = {};
  if (!form.email.includes('@')) errors.email = 'Invalid email';
  if (Object.keys(errors).length > 0) { setErrors(errors); return; }
  // proceed with valid form
}
```

**On blur** (better UX):
```tsx
function handleBlur(field: string) {
  setTouched(prev => ({ ...prev, [field]: true }));
}
// Show error only if touched[field] && errors[field]
```

---

## Exam Tips

- `defaultValue` vs `value`: use `defaultValue` for uncontrolled, `value` for controlled
- React warns if you switch a controlled input to uncontrolled (value → undefined)
- `e.preventDefault()` is required to prevent native form submission
- `FormData` API is key for React 19 form actions

---

## Challenges

1. [Controlled Form — Contact with Validation](./challenges/01-controlled-form/)
2. [Uncontrolled Form — File Upload](./challenges/02-uncontrolled-form/)

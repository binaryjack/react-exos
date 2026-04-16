# Testing React Components (Senior)

React Testing Library (RTL) is the standard for testing React. The core philosophy: **test behavior, not implementation**.

---

## Core Philosophy

> "The more your tests resemble the way your software is used, the more confidence they can give you."
> — Kent C. Dodds

- Query by what users SEE — text, labels, roles
- Avoid querying by CSS classes, component names, or internal state
- Test that things WORK, not how they're implemented internally

---

## Setup

```bash
npm install --save-dev @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
  },
});

// src/test-setup.ts
import '@testing-library/jest-dom';
```

---

## Query Priority (Most to Least Preferred)

| Query Type | When to Use | Example |
|-----------|------------|---------|
| `getByRole` | Interactive elements | `getByRole('button', { name: /submit/i })` |
| `getByLabelText` | Form inputs | `getByLabelText(/email/i)` |
| `getByPlaceholderText` | If no label | `getByPlaceholderText('Search...')` |
| `getByText` | Non-interactive text | `getByText('Welcome, Alice')` |
| `getByDisplayValue` | Input current value | `getByDisplayValue('Alice')` |
| `getByAltText` | Images | `getByAltText('Company logo')` |
| `getByTitle` | SVGs, title attributes | `getByTitle('Delete')` |
| `getByTestId` | Last resort | `getByTestId('custom-element')` |

---

## Query Variants

```ts
// getBy* — throws if not found (use for elements that MUST be present)
const button = screen.getByRole('button', { name: /submit/i });

// queryBy* — returns null if not found (use for asserting absence)
const error = screen.queryByText('Error message');
expect(error).not.toBeInTheDocument();

// findBy* — async, returns Promise (use for elements that appear after async ops)
const success = await screen.findByText('Success!');
```

---

## Testing with `userEvent`

Prefer `userEvent` over `fireEvent` — it simulates real browser events including intermediate events (focus, hover, keypress):

```ts
import userEvent from '@testing-library/user-event';

test('submitting form shows success message', async () => {
  const user = userEvent.setup(); // creates a user session
  
  render(<ContactForm />);
  
  await user.type(screen.getByLabelText(/name/i), 'Alice');
  await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
});
```

---

## Testing Async Behavior

```ts
// Loading states
test('shows loading then data', async () => {
  render(<UserList />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  // Wait for async to resolve
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

// With mock fetch
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => [{ id: 1, name: 'Alice' }],
});
```

---

## Testing Custom Hooks

Use `renderHook` from RTL:

```ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('increments count', () => {
  const { result } = renderHook(() => useCounter(0));
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});

// With a provider wrapper
test('hook that uses context', () => {
  const wrapper = ({ children }) => (
    <ThemeProvider theme="dark">{children}</ThemeProvider>
  );
  const { result } = renderHook(() => useTheme(), { wrapper });
  expect(result.current.theme).toBe('dark');
});
```

---

## Mocking

```ts
// Mock a module
vi.mock('../api/users', () => ({
  fetchUsers: vi.fn().mockResolvedValue([{ id: 1, name: 'Alice' }]),
}));

// Mock a function
const onSubmit = vi.fn();
render(<Form onSubmit={onSubmit} />);
await user.click(screen.getByRole('button', { name: /submit/i }));
expect(onSubmit).toHaveBeenCalledWith({ name: 'Alice' });

// Spy on existing module
vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => [] } as Response);
```

---

## Common Matchers (jest-dom)

```ts
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeEnabled();
expect(element).toBeDisabled();
expect(element).toHaveValue('Alice');
expect(element).toHaveTextContent('Welcome');
expect(element).toHaveAttribute('aria-expanded', 'true');
expect(element).toHaveFocus();
expect(element).toBeChecked();
```

---

## What NOT to Test

- Internal state values directly
- Which React component renders what
- CSS classes (unless they represent functional state)
- Implementation details (which hook, how many times re-rendered)

---

## Exam Tips

- `getByRole` is almost always the right query choice
- `findBy*` = async, `getBy*` = sync, `queryBy*` = nullable
- `userEvent.setup()` then `await user.click()` — always async
- Mock at the boundary (API calls, not internal functions)
- Wrap state-changing calls in `act()` when using `renderHook`
- Test the behavior users experience, not component internals

---

## Challenges

1. **01-test-counter-hook** — Write tests for a custom `useCounter` hook using `renderHook`
2. **02-test-async-component** — Test a component that fetches data with loading/error/success states

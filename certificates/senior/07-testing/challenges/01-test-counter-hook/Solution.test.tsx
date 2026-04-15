// Solution: Test a Custom Hook — useCounter
//
// This is the complete test file.
// Create this as useCounter.test.tsx to run with Vitest.
//
// Run with: pnpm test (or npx vitest)

import { act, renderHook } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Counter, useCounter } from './Challenge';

// ============================================================
// Hook tests — renderHook isolates the hook from any component
// ============================================================

describe('useCounter hook', () => {
  it('starts with the given initial value', () => {
    const { result } = renderHook(() => useCounter({ initial: 5 }));
    expect(result.current.count).toBe(5);
  });

  it('defaults to 0 when no initial is given', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increments count by 1', () => {
    const { result } = renderHook(() => useCounter({ initial: 0 }));

    // State updates must be wrapped in act()
    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('decrements count by 1', () => {
    const { result } = renderHook(() => useCounter({ initial: 5 }));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('resets count to initial value after changes', () => {
    const { result } = renderHook(() => useCounter({ initial: 3 }));

    act(() => {
      result.current.increment(); // 4
      result.current.increment(); // 5
      result.current.reset();     // back to 3
    });

    expect(result.current.count).toBe(3);
  });

  it('does not go below min', () => {
    const { result } = renderHook(() => useCounter({ initial: 0, min: 0 }));

    act(() => {
      result.current.decrement(); // should stay at 0
      result.current.decrement();
    });

    expect(result.current.count).toBe(0);
  });

  it('does not exceed max', () => {
    const { result } = renderHook(() => useCounter({ initial: 4, max: 5 }));

    act(() => {
      result.current.increment(); // 5
      result.current.increment(); // should stay at 5
      result.current.increment();
    });

    expect(result.current.count).toBe(5);
  });
});

// ==============================================================
// Component integration tests — tests from the user's perspective
// ==============================================================

describe('Counter component', () => {
  it('renders the initial count and all buttons', () => {
    render(<Counter initial={3} min={0} max={10} />);

    expect(screen.getByTestId('count-value')).toHaveTextContent('3');
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('clicking + increments the displayed count', async () => {
    const user = userEvent.setup();
    render(<Counter initial={0} max={5} />);

    await user.click(screen.getByRole('button', { name: '+' }));

    expect(screen.getByTestId('count-value')).toHaveTextContent('1');
  });

  it('clicking - decrements the displayed count', async () => {
    const user = userEvent.setup();
    render(<Counter initial={5} min={0} max={10} />);

    await user.click(screen.getByRole('button', { name: '-' }));

    expect(screen.getByTestId('count-value')).toHaveTextContent('4');
  });

  it('clicking Reset returns to initial value', async () => {
    const user = userEvent.setup();
    render(<Counter initial={2} min={0} max={10} />);

    await user.click(screen.getByRole('button', { name: '+' })); // 3
    await user.click(screen.getByRole('button', { name: '+' })); // 4
    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByTestId('count-value')).toHaveTextContent('2');
  });

  it('disables - button when count equals min', () => {
    render(<Counter initial={0} min={0} max={10} />);
    expect(screen.getByRole('button', { name: '-' })).toBeDisabled();
  });

  it('disables + button when count equals max', () => {
    render(<Counter initial={10} min={0} max={10} />);
    expect(screen.getByRole('button', { name: '+' })).toBeDisabled();
  });

  it('enables both buttons when count is between min and max', () => {
    render(<Counter initial={5} min={0} max={10} />);
    expect(screen.getByRole('button', { name: '-' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '+' })).toBeEnabled();
  });
});

// Challenge: Test a Custom Hook — useCounter
//
// File: useCounter.ts (implement first, then write tests)
//
// This file contains:
// 1. The useCounter hook implementation
// 2. A component that uses it (for integration testing)
// 3. TODO comments for the test file you need to write
//
// TASKS:
// TODO 1: In useCounter.test.ts, test that initial count equals the argument
// TODO 2: Test that increment() increases count by 1
// TODO 3: Test that decrement() decreases count by 1
// TODO 4: Test that reset() sets count back to initial value
// TODO 5: Test that count never goes below 0 (min boundary)
// TODO 6: Test that count never goes above max (max boundary)
// TODO 7: Test the Counter component renders count and all buttons
// TODO 8: Test that clicking the buttons updates the displayed count

import { useState, useCallback } from 'react';

// --- useCounter hook ---
interface UseCounterOptions {
  initial?: number;
  min?: number;
  max?: number;
}

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export function useCounter({
  initial = 0,
  min = -Infinity,
  max = Infinity,
}: UseCounterOptions = {}): UseCounterReturn {
  const [count, setCount] = useState(initial);

  const increment = useCallback(() => {
    setCount((c) => Math.min(c + 1, max));
  }, [max]);

  const decrement = useCallback(() => {
    setCount((c) => Math.max(c - 1, min));
  }, [min]);

  const reset = useCallback(() => {
    setCount(initial);
  }, [initial]);

  return { count, increment, decrement, reset };
}

// --- Counter component (for integration tests) ---
interface CounterProps {
  initial?: number;
  min?: number;
  max?: number;
}

export function Counter({ initial = 0, min = 0, max = 10 }: CounterProps) {
  const { count, increment, decrement, reset } = useCounter({ initial, min, max });

  return (
    <div>
      <p>Count: <span data-testid="count-value">{count}</span></p>
      <button onClick={decrement} disabled={count <= min}>-</button>
      <button onClick={increment} disabled={count >= max}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// --- Test file template (create useCounter.test.ts) ---
/*
import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCounter, Counter } from './Challenge';

describe('useCounter hook', () => {
  // TODO 1: initial value
  it('starts with the given initial value', () => {
    // TODO
  });

  // TODO 2: increment
  it('increments count by 1', () => {
    // TODO: use renderHook, call increment(), check result.current.count
  });

  // TODO 3: decrement
  it('decrements count by 1', () => {
    // TODO
  });

  // TODO 4: reset
  it('resets count to initial value', () => {
    // TODO
  });

  // TODO 5: min boundary
  it('does not go below min', () => {
    // TODO: init with min=0, decrement from 0, count should stay 0
  });

  // TODO 6: max boundary
  it('does not exceed max', () => {
    // TODO: init with max=5, increment 10 times, count should be 5
  });
});

describe('Counter component', () => {
  // TODO 7: renders
  it('renders count and buttons', () => {
    // TODO: render(<Counter initial={3} />)
    // check for count display, +, -, Reset buttons
  });

  // TODO 8: button interactions
  it('clicking + increments the displayed count', async () => {
    const user = userEvent.setup();
    render(<Counter initial={0} max={5} />);
    // TODO: click +, check displayed count is 1
  });

  it('disables - button at min', () => {
    // TODO: render with initial=0, min=0, check - is disabled
  });
});
*/

export default function ChallengeInfo() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h2>Testing Challenge</h2>
      <p>Create <code>useCounter.test.ts</code> in this folder and implement all TODO tests.</p>
      <p>The <code>useCounter</code> hook and <code>Counter</code> component are already implemented above.</p>
      <Counter initial={3} min={0} max={10} />
    </div>
  );
}

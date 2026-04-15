/**
 * CHALLENGE 07 — Custom Hooks: useLocalStorage
 *
 * Build a `useLocalStorage` custom hook that:
 * 1. Reads initial value from localStorage (with a fallback)
 * 2. Returns a stateful value and a setter (same API as useState)
 * 3. Keeps localStorage in sync when the value changes
 * 4. Handles JSON serialization/deserialization
 * 5. Is generic: useLocalStorage<T>(key, initialValue)
 *
 * Then build a `useDebounce` hook:
 * 1. Takes a value and a delay (ms)
 * 2. Returns a debounced version of the value
 * 3. Only updates the returned value after the delay has passed without changes
 *
 * Use both hooks together in a persisted search component.
 *
 * Key concepts tested:
 * - Custom hook extraction pattern
 * - Generic hooks with TypeScript
 * - Combining useState + useEffect in a custom hook
 * - Lazy initialization of useState
 */

import { useEffect, useState } from 'react';

// TODO 1: Implement useLocalStorage<T>
// Signature: (key: string, initialValue: T) => [T, (value: T) => void]
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // TODO: Use lazy initializer to read from localStorage on first render
  // TODO: Sync to localStorage when value changes

  const [storedValue, setStoredValue] = useState<T>(initialValue);
  return [storedValue, setStoredValue];
}

// TODO 2: Implement useDebounce<T>
// Signature: (value: T, delay: number) => T
export function useDebounce<T>(value: T, delay: number): T {
  // TODO: Return a debounced value that only updates after `delay` ms
  return value;
}

// --- Demo component using both hooks ---
export default function PersistedSearch() {
  const [query, setQuery] = useLocalStorage('search-query', '');
  const debouncedQuery = useDebounce(query, 500);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search (persisted across refreshes)..."
      />
      <p>Searching for: <strong>{debouncedQuery}</strong></p>
      <p><small>Refresh the page — your search is saved!</small></p>
    </div>
  );
}

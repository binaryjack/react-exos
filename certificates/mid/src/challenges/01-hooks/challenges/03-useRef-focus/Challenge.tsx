/**
 * CHALLENGE 03 — useRef: Focus Management
 *
 * Build an accessible search bar that:
 * 1. Has an input and a clear (×) button
 * 2. When the user clicks the clear button:
 *    - Clears the input value
 *    - Returns focus to the input (the user shouldn't have to click the input again)
 * 3. Has a "Focus Search" external button that focuses the input from outside
 * 4. Tracks how many times the input was changed WITHOUT causing a re-render for the count
 *    (hint: use a ref for the counter, not state)
 * 5. Show the change count only when the user blurs the input (use state for this display)
 *
 * Key concepts tested:
 * - useRef for DOM access (focus management)
 * - useRef for mutable values (change counter) — does NOT trigger re-render
 * - Difference between useRef and useState
 */

import { useRef, useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(0);

  // TODO 1: Create a ref for the input element

  // TODO 2: Create a ref for the change counter (start at 0)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    // TODO 3: Increment the change counter ref (no re-render needed)
  }

  function handleClear() {
    setQuery('');
    // TODO 4: Focus the input after clearing
  }

  function handleBlur() {
    // TODO 5: Sync the change count ref value to displayCount state
    // (this is when we want to update the UI)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          onBlur={handleBlur}
          // TODO 6: Attach the ref to this input
        />
        {query && (
          <button onClick={handleClear} aria-label="Clear search">
            ×
          </button>
        )}
      </div>

      {/* TODO 7: This button should work even though it's outside the input */}
      <button onClick={() => { /* TODO: focus the input */ }}>
        Focus Search
      </button>

      <p>Changes since last blur: {displayCount}</p>
    </div>
  );
}

/**
 * SOLUTION 03 — useRef: Focus Management
 */

import { useRef, useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(0);

  // Ref for DOM access — doesn't cause re-renders
  const inputRef = useRef<HTMLInputElement>(null);

  // Ref for mutable counter — persists across renders, no re-render on change
  const changeCountRef = useRef(0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    // Mutate ref directly — this does NOT cause a re-render
    changeCountRef.current += 1;
  }

  function handleClear() {
    setQuery('');
    // Return focus to input after clearing (accessibility best practice)
    inputRef.current?.focus();
  }

  function handleBlur() {
    // Only update display state when user leaves the input
    // This syncs the ref value → state → triggers one re-render
    setDisplayCount(changeCountRef.current);
    changeCountRef.current = 0; // reset for next session
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {query && (
          <button onClick={handleClear} aria-label="Clear search">
            ×
          </button>
        )}
      </div>

      <button onClick={() => inputRef.current?.focus()}>
        Focus Search
      </button>

      <p>Changes since last blur: {displayCount}</p>
    </div>
  );
}

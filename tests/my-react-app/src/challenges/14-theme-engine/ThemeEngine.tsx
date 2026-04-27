import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Implement ThemeContext to manage 'light' | 'dark' | 'system'.
 * 2. Detect and listen to system theme changes.
 * 3. Update CSS variables on :root.
 */

export default function ThemeEngine() {
  const [theme, setTheme] = useState('system');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Theme Engine</h1>
      <p>Current Theme: {theme}</p>
      
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: 'var(--bg-color, #eee)',
        color: 'var(--text-color, #333)',
        border: '1px solid #ccc'
      }}>
        This box should change colors based on the theme.
      </div>
    </div>
  );
}

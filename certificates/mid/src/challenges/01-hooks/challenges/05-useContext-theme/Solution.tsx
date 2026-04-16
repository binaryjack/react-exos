/**
 * SOLUTION 05 — useContext: Theme System
 */

import { createContext, useContext, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

// createContext needs a default value matching the shape
// Using null + assertion for safety — provider required
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // useMemo ensures the context value object is not recreated on every render
  // (functions like toggleTheme are stable but the object itself would be new)
  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => setTheme(t => (t === 'light' ? 'dark' : 'light')),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Custom hook with safety check — throws if used outside provider
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}

const CARD_STYLES: Record<Theme, React.CSSProperties> = {
  light: { background: '#fff', color: '#000', border: '1px solid #ccc' },
  dark: { background: '#222', color: '#fff', border: '1px solid #555' },
};

export function ThemedCard({ title, content }: { title: string; content: string }) {
  const { theme } = useTheme();
  return (
    <div style={{ ...CARD_STYLES[theme], padding: '16px', borderRadius: '8px' }}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <ThemedCard title="Hello" content="This card adapts to the theme." />
    </ThemeProvider>
  );
}

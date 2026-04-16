/**
 * CHALLENGE 05 — useContext: Theme System
 *
 * Build a theme system using React Context:
 * 1. Create a ThemeContext that provides: theme ('light' | 'dark') and toggleTheme()
 * 2. ThemeProvider component wraps the app and manages the theme state
 * 3. useTheme custom hook for consuming the context (with safety check)
 * 4. ThemeToggle button component that uses the hook
 * 5. ThemedCard component that reads the theme and applies different styles
 *
 * Key concepts tested:
 * - createContext with a typed default value
 * - Context Provider pattern
 * - Custom hook for context consumption
 * - Context value stability (avoid inline object creation)
 */

import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

// TODO 1: Create ThemeContext using createContext
// Provide a sensible default value

// TODO 2: Implement ThemeProvider component
// It should manage the theme state and provide context
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // TODO: state and toggleTheme function
  // IMPORTANT: Avoid creating a new object on every render
  // (hint: use useMemo or structure to minimize re-renders)
  return <div>{children}</div>; // TODO: wrap with context provider
}

// TODO 3: Implement useTheme custom hook
// It should throw an error if used outside ThemeProvider
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext!); // TODO: replace ThemeContext! with your context
  // TODO: add safety check
  return ctx;
}

// TODO 4: ThemeToggle — reads toggleTheme from context and renders a button
export function ThemeToggle() {
  // TODO: use useTheme hook
  return <button>Toggle Theme</button>;
}

// TODO 5: ThemedCard — reads theme and applies different styles
const CARD_STYLES: Record<Theme, React.CSSProperties> = {
  light: { background: '#fff', color: '#000', border: '1px solid #ccc' },
  dark: { background: '#222', color: '#fff', border: '1px solid #555' },
};

export function ThemedCard({ title, content }: { title: string; content: string }) {
  // TODO: use useTheme hook and apply CARD_STYLES[theme]
  return (
    <div style={{ padding: '16px', borderRadius: '8px' }}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

// Demo App
export default function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <ThemedCard title="Hello" content="This card adapts to the theme." />
    </ThemeProvider>
  );
}

// Fix this — it's used above as a placeholder
const ThemeContext = null as unknown as React.Context<ThemeContextValue>;

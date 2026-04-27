# Challenge 14: Dynamic Theme Engine (Senior - TSX)

## Goal

Implement a theme engine that supports light, dark, and "system" modes using Context and CSS variables.

## Requirements

1. **Theme Context**: Provide a `ThemeContext` with current theme state and a `setTheme` function.
2. **System Preference**: On initial load, if the theme is set to "system", detect the user's OS preference using `window.matchMedia('(prefers-color-scheme: dark)')`.
3. **Dynamic Updates**: Listen for system preference changes and update the UI accordingly if "system" mode is active.
4. **CSS Variables**: Inject theme values (colors, backgrounds) into CSS variables on the root element.
5. **Persistence**: Save the user's theme selection in `localStorage`.

## Constraints

- Use TypeScript for the theme types ('light' | 'dark' | 'system').
- Ensure the transition between themes is smooth.
- Implement a `useTheme` custom hook to consume the context easily.

## Why a Theme Engine?

Managing global styling state and syncing it with browser APIs/local storage is a common requirement for modern web applications.

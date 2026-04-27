# Challenge 12: Resilient Data Fetching (Senior - TSX)

## Goal

Implement a modern, resilient data fetching pattern using React 19's `use` hook, `Suspense`, and `ErrorBoundary`.

## Requirements

1. **Async Component**: Create a component that fetches user profiles using the `use` hook (passing a promise).
2. **Suspense**: Wrap the component in `Suspense` with a proper skeleton loader fallback.
3. **Error Boundaries**: Wrap the component in an `ErrorBoundary` to catch network failures. Provide a "Retry" mechanism in the error boundary.
4. **Race Conditions**: Handle switching between different user IDs rapidly and ensure the UI stays consistent.

## Constraints

- Use React 19's `use` hook for promise resolution inside the render phase.
- Implement a custom `ErrorBoundary` component (class component or a wrapper).
- The "Retry" button should trigger a re-render/re-fetch of the failed component.

## Why use/Suspense?

The `use` hook and Suspense simplify async logic by removing the need for `useState` and `useEffect` for data fetching, leading to cleaner, more declarative code.

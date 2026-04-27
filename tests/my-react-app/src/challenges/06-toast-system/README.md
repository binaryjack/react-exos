# Challenge 6: Global Toast System (Senior - TSX)

## Goal
Implement a global notification (toast) system using `useSyncExternalStore` to connect a non-React state store to your components.

## Requirements
1. **Store Subscription**: Use the `useSyncExternalStore` hook to subscribe to the `toastStore` provided in `toastStore.ts`.
2. **Global Container**: Create a `ToastContainer` component that renders all active toasts. This component should be rendered once at the top level of the app (or via a Portal).
3. **Triggering Toasts**: Implement buttons in a separate component that trigger different types of toasts (success, error, info) by calling `toastStore.addToast()`.
4. **Auto-dismiss**: Ensure toasts disappear after a delay (this logic is partially in the store, but the UI must handle the removal gracefully).

## Constraints
- Use `createPortal` to render the `ToastContainer` outside the main DOM hierarchy (e.g., in a div with id `toast-root`).
- The `toastStore` must remain a plain JavaScript/TypeScript object without using React state internally.
- Use TypeScript interfaces for all components and store logic.

## Why useSyncExternalStore?
This is the recommended way to subscribe to external data sources (like a Redux-like store, a browser API, or a websocket) to ensure "tearing" doesn't occur during concurrent rendering.

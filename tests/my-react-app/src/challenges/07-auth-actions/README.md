# Challenge 7: React 19 Auth Flow (Senior - TSX)

## Goal

Implement a login form using React 19's `useActionState` and `useFormStatus` for seamless server-side simulation.

## Requirements

1. **Server Action**: Implement a `loginAction` that simulates a server request (2 seconds delay). It should return either a success message or an error if the password is "wrong".
2. **Action State**: Use `useActionState` to manage the form's return value, loading state, and previous input values.
3. **Submit Button**: Create a `SubmitButton` sub-component that uses `useFormStatus` to show a "Logging in..." state while the action is pending.
4. **Validation**: Show error messages returned from the "server" directly in the UI.

## Constraints

- Use the new React 19 hooks.
- Ensure the form is fully functional without manual `isLoading` state in the main component.
- The `loginAction` should be passed to the form's `action` attribute.

## Why useActionState?

It replaces the manual `useState` for handling form results and loading states, providing a more declarative way to handle asynchronous form submissions.

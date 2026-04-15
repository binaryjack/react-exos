/**
 * CHALLENGE — Context + useReducer: Auth System
 *
 * Build a complete auth system using Context + useReducer:
 *
 * 1. AuthProvider: manages auth state (user, isLoggedIn)
 *    - Uses useReducer with actions: LOGIN, LOGOUT
 *    - Provides state and dispatch through SEPARATE contexts (performance!)
 *
 * 2. Custom hooks:
 *    - useAuthState(): returns auth state
 *    - useAuthDispatch(): returns dispatch function
 *
 * 3. LoginForm: reads dispatch, calls LOGIN action
 *
 * 4. UserProfile: reads state, shows user info
 *    - Only re-renders when state changes (NOT when dispatch context changes)
 *
 * 5. LogoutButton: reads only dispatch, calls LOGOUT
 *    - Should NOT re-render when user state changes (separate context!)
 *
 * Key concepts tested:
 * - Context + useReducer combination
 * - Splitting state context from dispatch context for performance
 * - Custom hooks per context
 */

import { createContext, useContext, useReducer } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

// TODO 1: Implement authReducer

// TODO 2: Create two separate contexts:
//   - AuthStateContext (for state)
//   - AuthDispatchContext (for dispatch)
// Use null as default — provider is required

// TODO 3: Implement AuthProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// TODO 4: Implement useAuthState and useAuthDispatch hooks
// Both should throw if used outside AuthProvider
export function useAuthState(): AuthState {
  return { user: null, isLoggedIn: false }; // placeholder
}

export function useAuthDispatch(): React.Dispatch<AuthAction> {
  return () => {}; // placeholder
}

// TODO 5: LoginForm - uses dispatch only (no state needed)
const MOCK_USER: User = { id: '1', name: 'Alice Dev', email: 'alice@dev.com' };

function LoginForm() {
  // TODO: use useAuthDispatch, dispatch LOGIN with MOCK_USER on button click
  return (
    <form onSubmit={e => e.preventDefault()}>
      <p>Logged in as: guest</p>
      <button type="submit">Login as Alice</button>
    </form>
  );
}

// TODO 6: UserProfile - uses state only
function UserProfile() {
  // TODO: use useAuthState, show user info if logged in
  return <div>No user</div>;
}

// TODO 7: LogoutButton - uses dispatch only
function LogoutButton() {
  // TODO: use useAuthDispatch, dispatch LOGOUT on click
  // This component should NOT re-render when user data changes!
  return <button>Logout</button>;
}

export default function App() {
  return (
    <AuthProvider>
      <h2>Auth Demo</h2>
      <UserProfile />
      <LoginForm />
      <LogoutButton />
    </AuthProvider>
  );
}

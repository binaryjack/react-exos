/**
 * SOLUTION — Context + useReducer: Auth System
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

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, isLoggedIn: true };
    case 'LOGOUT':
      return { user: null, isLoggedIn: false };
    default:
      return state;
  }
}

// SPLIT contexts: components subscribe only to what they need
// UserProfile (reads state) won't re-render when dispatch changes
// LogoutButton (reads dispatch) won't re-render when user data changes
const AuthStateContext = createContext<AuthState | null>(null);
const AuthDispatchContext = createContext<React.Dispatch<AuthAction> | null>(null);

const INITIAL_STATE: AuthState = { user: null, isLoggedIn: false };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

export function useAuthState(): AuthState {
  const ctx = useContext(AuthStateContext);
  if (!ctx) throw new Error('useAuthState must be within AuthProvider');
  return ctx;
}

export function useAuthDispatch(): React.Dispatch<AuthAction> {
  const ctx = useContext(AuthDispatchContext);
  if (!ctx) throw new Error('useAuthDispatch must be within AuthProvider');
  return ctx;
}

const MOCK_USER: User = { id: '1', name: 'Alice Dev', email: 'alice@dev.com' };

function LoginForm() {
  const dispatch = useAuthDispatch(); // Only subscribes to dispatch context

  return (
    <form onSubmit={e => { e.preventDefault(); dispatch({ type: 'LOGIN', payload: MOCK_USER }); }}>
      <button type="submit">Login as Alice</button>
    </form>
  );
}

function UserProfile() {
  const { user, isLoggedIn } = useAuthState(); // Only subscribes to state context

  if (!isLoggedIn || !user) return <p>Not logged in</p>;

  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

function LogoutButton() {
  const dispatch = useAuthDispatch(); // Only dispatch — won't re-render on user change
  const { isLoggedIn } = useAuthState();

  if (!isLoggedIn) return null;

  return (
    <button onClick={() => dispatch({ type: 'LOGOUT' })}>
      Logout
    </button>
  );
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

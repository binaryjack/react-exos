/**
 * CHALLENGE 02 — useEffect: Data Fetching with Cleanup
 *
 * Build a user profile viewer that:
 * 1. Accepts a `userId` prop
 * 2. Fetches user data from `https://jsonplaceholder.typicode.com/users/{userId}`
 * 3. Shows a loading state while fetching
 * 4. Shows an error message if the fetch fails
 * 5. Displays the user's name, email, and company name
 * 6. When `userId` changes, cancels the previous fetch and starts a new one
 *    (use AbortController to prevent race conditions)
 *
 * Key concepts tested:
 * - useEffect cleanup function
 * - AbortController for cancelling fetches
 * - Dependency array correctness
 * - Async patterns inside useEffect (can't make the callback async directly)
 */

import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

interface Props {
  userId: number;
}

// TODO 1: Complete the UserProfile component
export default function UserProfile({ userId }: Props) {
  // TODO 2: Set up state for: user, isLoading, error

  // TODO 3: Implement a useEffect that:
  //   - Sets isLoading to true
  //   - Creates an AbortController
  //   - Fetches the user (pass the signal to fetch)
  //   - On success: sets the user and isLoading to false
  //   - On error: if it's NOT an AbortError, sets the error message
  //   - Returns a cleanup function that aborts the controller
  //   - Has the correct dependency array

  // TODO 4: Render loading, error, and data states

  return <div>{/* Your JSX here */}</div>;
}

// --- Demo wrapper (you can ignore this) ---
export function App() {
  const [userId, setUserId] = useState(1);
  return (
    <div>
      <div>
        {[1, 2, 3].map(id => (
          <button key={id} onClick={() => setUserId(id)}>
            User {id}
          </button>
        ))}
      </div>
      <UserProfile userId={userId} />
    </div>
  );
}

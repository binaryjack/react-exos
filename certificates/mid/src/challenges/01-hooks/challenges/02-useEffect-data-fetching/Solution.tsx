/**
 * SOLUTION 02 — useEffect: Data Fetching with Cleanup
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

export default function UserProfile({ userId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when userId changes
    setUser(null);
    setError(null);
    setIsLoading(true);

    // AbortController lets us cancel an in-flight fetch
    const controller = new AbortController();

    // Cannot make the effect callback async — use an inner async function
    async function fetchUser() {
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        // Only handle errors that are NOT from aborting
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();

    // Cleanup: abort the fetch when userId changes or component unmounts
    return () => controller.abort();
  }, [userId]); // userId is the only dependency

  if (isLoading) return <p>Loading user {userId}...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Company: {user.company.name}</p>
    </div>
  );
}

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

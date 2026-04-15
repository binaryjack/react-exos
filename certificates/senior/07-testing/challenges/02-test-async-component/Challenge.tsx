// Challenge: Test Async Component
//
// This file contains a UserList component that fetches users from an API.
// You need to write tests for its loading, error, and success states.
//
// TASKS:
// TODO 1: Mock global.fetch (or vi.mock the api module)
// TODO 2: Test that loading state shows while fetch is in progress
// TODO 3: Test that user names appear after successful fetch
// TODO 4: Test that error message shows when fetch fails
// TODO 5: Test "retry" button resets to loading and fetches again
// TODO 6: Use findBy* for elements that appear after async ops
// TODO 7: Use queryBy* to assert elements are GONE

import { useEffect, useState } from 'react';

// --- Types ---
interface User {
  id: number;
  name: string;
  email: string;
}

// --- API function (mock this in tests) ---
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

// --- UserList component ---
type Status = 'idle' | 'loading' | 'error' | 'success';

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setStatus('loading');
    setError(null);

    try {
      const data = await fetchUsers();
      setUsers(data);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (status === 'loading') {
    return <div aria-busy="true">Loading users...</div>;
  }

  if (status === 'error') {
    return (
      <div role="alert">
        <p>Error: {error}</p>
        <button onClick={loadUsers}>Retry</button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <ul aria-label="user list">
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> — {user.email}
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

// --- Test file template (create UserList.test.tsx) ---
/*
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UserList, fetchUsers } from './Challenge';

// TODO 1: Mock the fetchUsers function
vi.mock('./Challenge', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./Challenge')>();
  return {
    ...actual,
    fetchUsers: vi.fn(),
  };
});

const mockFetchUsers = vi.mocked(fetchUsers);

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TODO 2: Loading state
  it('shows loading state initially', async () => {
    mockFetchUsers.mockResolvedValue([]); // pending promise
    render(<UserList />);
    // TODO: check loading text is visible
  });

  // TODO 3: Success state
  it('renders user names after successful fetch', async () => {
    mockFetchUsers.mockResolvedValue([
      { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
      { id: 2, name: 'Bob Johnson', email: 'bob@example.com' },
    ]);
    render(<UserList />);
    // TODO: use findByText to wait for 'Alice Smith'
    // TODO: check both users appear
    // TODO: assert loading is gone
  });

  // TODO 4: Error state
  it('shows error message when fetch fails', async () => {
    mockFetchUsers.mockRejectedValue(new Error('Network error'));
    render(<UserList />);
    // TODO: use findByRole('alert') to wait for error
    // TODO: check error message contains 'Network error'
  });

  // TODO 5: Retry
  it('retries fetch when Retry button is clicked', async () => {
    const user = userEvent.setup();
    mockFetchUsers
      .mockRejectedValueOnce(new Error('Network error'))   // first call fails
      .mockResolvedValue([{ id: 1, name: 'Alice', email: 'a@b.com' }]); // retry succeeds

    render(<UserList />);

    // Wait for error state
    // TODO: await error to appear
    // TODO: click Retry
    // TODO: await Alice to appear
    // TODO: assert Retry button is gone
  });
});
*/

export default function ChallengeInfo() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h2>Async Testing Challenge</h2>
      <p>Create <code>UserList.test.tsx</code> implementing all TODO tests above.</p>
      <p>The UserList component fetches real data (see it live below):</p>
      <UserList />
    </div>
  );
}

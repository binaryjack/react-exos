// Solution: Test Async Component — UserList.test.tsx
//
// Key points:
// - vi.mock() hoists to top of file — mock the module, not global.fetch
// - findBy* awaits elements that appear asynchronously
// - queryBy* returns null (no throw) — use for asserting element is GONE
// - beforeEach(vi.clearAllMocks) resets mock call counts between tests
// - mockRejectedValue simulates network errors
// - The retry test uses mockRejectedValueOnce + mockResolvedValue to chain behaviors

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserList, fetchUsers } from './Challenge';

// ✅ Mock the specific export — not global.fetch
// vi.mock hoists, so the factory runs before any imports
vi.mock('./Challenge', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./Challenge')>();
  return {
    ...actual, // keep UserList and other exports
    fetchUsers: vi.fn(), // replace only fetchUsers
  };
});

const mockFetchUsers = vi.mocked(fetchUsers);

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset call history between tests
  });

  // ✅ Loading state — use a never-resolving promise to keep it in loading
  it('shows loading state initially', async () => {
    // Promise that never resolves — component stays in loading
    mockFetchUsers.mockReturnValue(new Promise(() => {}));
    render(<UserList />);

    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });

  // ✅ Success state
  it('renders user names after successful fetch', async () => {
    mockFetchUsers.mockResolvedValue([
      { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
      { id: 2, name: 'Bob Johnson', email: 'bob@example.com' },
    ]);

    render(<UserList />);

    // findBy* waits for the element to appear (up to 1000ms by default)
    expect(await screen.findByText(/Alice Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Bob Johnson/i)).toBeInTheDocument();

    // Loading is gone
    expect(screen.queryByText(/loading users/i)).not.toBeInTheDocument();
  });

  // ✅ Error state
  it('shows error message when fetch fails', async () => {
    mockFetchUsers.mockRejectedValue(new Error('Network error'));

    render(<UserList />);

    // Wait for the error alert to appear
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Network error');
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  // ✅ Error state — no user list visible
  it('does not show user list when in error state', async () => {
    mockFetchUsers.mockRejectedValue(new Error('Oops'));

    render(<UserList />);

    await screen.findByRole('alert');
    expect(screen.queryByRole('list', { name: /user list/i })).not.toBeInTheDocument();
  });

  // ✅ Retry flow
  it('retries fetch when Retry button is clicked', async () => {
    const user = userEvent.setup();

    mockFetchUsers
      .mockRejectedValueOnce(new Error('Network error')) // first call fails
      .mockResolvedValue([{ id: 1, name: 'Alice Smith', email: 'alice@example.com' }]); // retry succeeds

    render(<UserList />);

    // Wait for error state
    await screen.findByRole('alert');
    expect(screen.getByText(/Network error/i)).toBeInTheDocument();

    // Click retry
    await user.click(screen.getByRole('button', { name: /retry/i }));

    // Should show loading again (briefly)
    // Then success
    expect(await screen.findByText(/Alice Smith/i)).toBeInTheDocument();

    // Error is gone
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // fetchUsers was called twice (initial + retry)
    expect(mockFetchUsers).toHaveBeenCalledTimes(2);
  });

  // ✅ Empty state
  it('renders an empty list when API returns no users', async () => {
    mockFetchUsers.mockResolvedValue([]);

    render(<UserList />);

    const list = await screen.findByRole('list', { name: /user list/i });
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(0);
  });
});

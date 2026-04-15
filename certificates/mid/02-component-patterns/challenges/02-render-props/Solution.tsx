/**
 * SOLUTION 02 — Render Props: Generic Data Fetcher
 */

import { useEffect, useState } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface DataFetcherProps<T> {
  url: string;
  render: (state: FetchState<T>) => React.ReactNode;
}

function DataFetcher<T>({ url, render }: DataFetcherProps<T>) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    setState({ data: null, isLoading: true, error: null });
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then(data => setState({ data, isLoading: false, error: null }))
      .catch(err => {
        if (err.name !== 'AbortError') {
          setState({ data: null, isLoading: false, error: err.message });
        }
      });

    return () => controller.abort();
  }, [url]);

  return <>{render(state)}</>;
}

interface User { id: number; name: string; email: string; }
interface Post { id: number; title: string; body: string; }

function UserList() {
  return (
    <DataFetcher<User[]>
      url="https://jsonplaceholder.typicode.com/users"
      render={({ data, isLoading, error }) => {
        if (isLoading) return <p>Loading users...</p>;
        if (error) return <p style={{ color: 'red' }}>{error}</p>;
        return (
          <ul>
            {data?.map(user => (
              <li key={user.id}>
                <strong>{user.name}</strong> — {user.email}
              </li>
            ))}
          </ul>
        );
      }}
    />
  );
}

function PostList() {
  return (
    <DataFetcher<Post[]>
      url="https://jsonplaceholder.typicode.com/posts?_limit=5"
      render={({ data, isLoading, error }) => {
        if (isLoading) return <p>Loading posts...</p>;
        if (error) return <p style={{ color: 'red' }}>{error}</p>;
        return (
          <div>
            {data?.map(post => (
              <article key={post.id} style={{ marginBottom: '16px' }}>
                <h3>{post.title}</h3>
                <p>{post.body.slice(0, 100)}...</p>
              </article>
            ))}
          </div>
        );
      }}
    />
  );
}

export default function App() {
  return (
    <div>
      <h2>Users</h2>
      <UserList />
      <h2>Posts</h2>
      <PostList />
    </div>
  );
}

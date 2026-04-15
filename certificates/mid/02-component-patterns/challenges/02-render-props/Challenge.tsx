/**
 * CHALLENGE 02 — Render Props: Generic Data Fetcher
 *
 * Build a generic `DataFetcher` component that:
 * 1. Accepts a `url` string and a `render` function prop
 * 2. Fetches data from the URL
 * 3. Passes { data, isLoading, error } to the render function
 * 4. The render function controls what gets displayed
 *
 * Then use it to render a list of users and a list of posts
 * with completely different UIs — without duplicating fetch logic.
 *
 * Key concepts tested:
 * - Render props pattern
 * - Separating data logic from presentation
 * - Generic TypeScript with render props
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

// TODO 1: Implement DataFetcher component
// It should manage fetch state internally and call render() with the state
function DataFetcher<T>({ url, render }: DataFetcherProps<T>) {
  // TODO: implement fetch logic and call render with state
  return <>{render({ data: null, isLoading: true, error: null })}</>;
}

// --- Types for the demo ---
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

// TODO 2: Use DataFetcher to render a user list
function UserList() {
  return (
    <DataFetcher<User[]>
      url="https://jsonplaceholder.typicode.com/users"
      render={({ data, isLoading, error }) => {
        // TODO: handle loading, error, and data states
        return <div>Users here</div>;
      }}
    />
  );
}

// TODO 3: Use DataFetcher to render a post list with a different UI
function PostList() {
  return (
    <DataFetcher<Post[]>
      url="https://jsonplaceholder.typicode.com/posts?_limit=5"
      render={({ data, isLoading, error }) => {
        // TODO: handle loading, error, and data states
        return <div>Posts here</div>;
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

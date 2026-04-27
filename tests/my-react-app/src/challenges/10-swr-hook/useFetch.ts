import { useState, useEffect } from 'react';

// TODO: Implement a global cache
const cache = new Map<string, any>();

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  // TODO: Implement fetching logic with AbortController and caching
  // 1. Check cache first
  // 2. Fetch and update cache
  // 3. Handle cleanup (abort)
  // 4. Return { data, error, loading, refetch }

  return { data, error, loading, refetch: () => {} };
}

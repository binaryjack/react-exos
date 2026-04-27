# Challenge 10: Custom SWR-like Hook (Senior - TSX)

## Goal
Implement a robust `useFetch` hook that handles caching, manual refetching, and request cancellation.

## Requirements
1. **Request Lifecycle**: The hook should return `{ data, error, loading, refetch }`.
2. **Caching**: Store fetched data in a global cache (outside the hook) so that subsequent calls with the same URL return the cached data immediately before revalidating.
3. **Cancellation**: Use `AbortController` to cancel the previous request if the URL changes while a fetch is in progress.
4. **Refetching**: Provide a `refetch` function that forces a new network request and updates the cache.
5. **Types**: Use generics so the hook can infer the return data type (e.g., `useFetch<User[]>(url)`).

## Constraints
- Do not use `useSyncExternalStore` for the cache yet (unless you want to be extra senior). A simple object or Map is fine for this challenge.
- Handle error states gracefully.
- Ensure the effect cleanup cancels the fetch.

## Why a Custom Data Hook?
Abstracting data fetching logic into a custom hook makes components cleaner and allows for advanced features like caching, polling, and retry logic to be implemented once and reused everywhere.

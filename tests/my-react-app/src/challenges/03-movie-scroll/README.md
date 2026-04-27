# Challenge 3: Infinite Movie Scroll (Mid - JSX)

## Goal
Implement an infinite scroll movie gallery using the `Intersection Observer API` and custom hooks.

## Requirements
1. **Custom Hook**: Create a `useInfiniteMovies` hook that manages state for movies, current page, loading status, and if there are more items to fetch.
2. **Infinite Scroll**: Implement a "trigger" element at the bottom of the list. When this element becomes visible in the viewport, the next page of movies should be fetched.
3. **Service Integration**: Use `fetchMovies(page, limit)` from `movieService.js`.
4. **UI**: Display the list of movies. Show a "Loading..." indicator when fetching data and "End of list" when no more movies are available.

## Constraints
- Use `useRef` to target the scroll trigger element.
- Use `useEffect` to set up and clean up the `IntersectionObserver`.
- Ensure you don't trigger multiple fetches for the same page.

## Mock Service
- `fetchMovies(page, limit)`: Returns `{ data: Array, hasMore: boolean }`.

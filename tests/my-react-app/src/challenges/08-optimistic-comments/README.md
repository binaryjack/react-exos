# Challenge 8: Optimistic UI (Senior - TSX)

## Goal
Implement a comment system with instant UI feedback using React 19's `useOptimistic` and `useTransition`.

## Requirements
1. **Mock API**: Implement an `addCommentApi` that takes 2 seconds to complete and sometimes fails.
2. **Optimistic State**: Use `useOptimistic` to show the new comment in the list immediately while the "server" is processing.
3. **Async Transition**: Wrap the submission logic in `startTransition` to enable the optimistic update.
4. **Error Handling**: If the API fails, the optimistic comment should disappear, and an error message should be shown.

## Constraints
- Use React 19 hooks.
- The UI should never feel "stuck" or "laggy".
- Comments should be displayed with a "Sending..." status if they are in the optimistic phase.

## Why useOptimistic?
It allows for a better user experience by predicting the success of an operation and updating the UI immediately, then reconciling with the actual server result once it arrives.

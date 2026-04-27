# Challenge 1: Broken Chat Room (Mid - JSX)

## Goal
Fix a series of common React anti-patterns and implementation bugs in a Chat Room application.

## Requirements
1. **Service Integration**: Replace the stub "Loading..." or hardcoded messages with real welcome messages fetched from `chatService.getWelcomeMessages(roomId)`.
2. **Lifecycle Management**: The chat room should connect when entering and disconnect when leaving or switching rooms. Currently, it might be leaking connections or connecting too many times.
3. **Input Focus**: Implement a "Focus Input" button in the `ChatRoom` component that focuses the input field located inside the `ChatForm` sub-component.
4. **State Integrity**: Fix the issue where sending a message might use stale state or cause unexpected re-renders.

## Constraints
- Use `useRef` and `forwardRef` for focus management.
- Ensure `useEffect` cleanup is handled correctly to avoid memory leaks (check console for connection/disconnection logs).
- Do not move the `ChatForm` logic directly into `ChatRoom`; keep it as a sub-component.

## Mock Service
Use the provided `chatService.js`. It contains:
- `connect(roomId)`: Returns a cleanup function.
- `getWelcomeMessages(roomId)`: Returns a promise with 2 messages.

# Challenge 15: Virtual List Implementation (Senior+ - TSX)

## Goal

Optimize rendering for massive lists (10,000+ items) by implementing a basic "Virtual List" (windowing) from scratch.

## Requirements

1. **Windowing Logic**: Only render the items that are currently visible in the viewport (plus a small buffer).
2. **Scroll Math**:
   - Calculate the total height of the scroll container based on item count and item height.
   - Calculate the current `startIndex` and `endIndex` based on the scroll position.
   - Position visible items using absolute positioning or transforms.
3. **Performance**: Ensure scrolling is butter-smooth and doesn't cause layout shifts.
4. **Resizability**: Handle the case where the container height changes.

## Constraints

- Do not use `react-window` or `react-virtualized`.
- Assume items have a fixed height (e.g., 50px).
- Use `useRef` to track scroll position and `onScroll` events.

## Why Virtualization?

DOM nodes are expensive. Rendering 10k nodes will crash most browsers. Virtualization is the standard technique for displaying large datasets efficiently by recycling DOM elements.

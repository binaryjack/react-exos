# Challenge 5: Data Grid Optimizer (Senior - TSX)

## Goal
Optimize a high-frequency data grid to prevent unnecessary re-renders using advanced React memoization techniques.

## Requirements
1. **Performance Audit**: The current grid re-renders every row whenever the user types in the filter input. Your goal is to make only the filtered rows re-render (or none if the row data hasn't changed).
2. **Memoization**:
   - Wrap the `Row` component in `React.memo`.
   - Use `useCallback` for the click handler passed to rows.
   - Use `useMemo` for the expensive filtering logic.
3. **Expensive Calculation**: Simulate an expensive calculation inside each row (e.g., a loop) and show how memoization fixes the UI lag.

## Constraints
- Do not use external virtualization libraries (that's for another challenge).
- Focus strictly on `React.memo`, `useMemo`, and `useCallback`.
- The `DataGrid` component must manage the filter state.

## Tips
- Use the React DevTools Profiler to verify your fixes.
- Ensure the reference to the `onRowClick` function stays stable.

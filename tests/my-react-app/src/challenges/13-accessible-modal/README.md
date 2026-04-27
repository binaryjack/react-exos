# Challenge 13: Accessible Modal System (Senior - TSX)

## Goal
Build a fully accessible modal component from scratch, ensuring proper keyboard navigation and focus management.

## Requirements
1. **Portal**: Render the modal into a dedicated DOM node outside the root app.
2. **Focus Management**:
   - **Focus Trap**: When the modal is open, the user should not be able to tab out of it.
   - **Auto-focus**: Focus the first interactive element (or the close button) when opened.
   - **Restore Focus**: Focus the trigger button when the modal is closed.
3. **Keyboard Navigation**: Close the modal when the `Escape` key is pressed.
4. **Accessibility (A11y)**: Add appropriate ARIA roles (`dialog`, `aria-modal="true"`) and labels.

## Constraints
- Do not use modal libraries like Headless UI or Radix.
- Handle the case where there are multiple interactive elements inside the modal.
- Ensure clicking the backdrop (overlay) closes the modal.

## Why focus management?
Accessibility is a key requirement for senior developers. Managing focus manually is often necessary for complex UI components to ensure screen readers and keyboard users can navigate effectively.

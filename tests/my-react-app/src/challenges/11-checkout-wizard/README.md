# Challenge 11: Multi-step Checkout Wizard (Senior - TSX)

## Goal
Manage a complex, multi-page form with cross-step validation and state persistence.

## Requirements
1. **Wizard Flow**: Implement 3 steps: 
   - `PersonalInfo` (Name, Email)
   - `ShippingDetails` (Address, Zip)
   - `PaymentInfo` (Credit Card placeholder)
2. **State Machine**: Implement logic to move "Next" and "Back" between steps. Prevent going to the next step if the current step is invalid.
3. **Data Review**: The final step should show a summary of all data entered in previous steps for confirmation.
4. **Validation**: Use a central validation logic or per-step validation.
5. **Types**: Define a unified `CheckoutState` interface.

## Constraints
- Do not use external state management like Redux or Zustand (unless you feel like implementing a mini-store).
- The "Summary" step must allow jumping back to specific steps to edit information.
- Handle "Submission" with a 1-second delay and success message.

## Why a Wizard?
Multi-step forms are common in e-commerce and onboarding. Managing the state transition, validation, and data persistence between steps requires careful architectural planning.

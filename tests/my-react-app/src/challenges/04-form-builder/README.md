# Challenge 4: Smart Form Builder (Mid - JSX)

## Goal

Create a dynamic form builder that renders inputs based on a schema and handles validation.

## Requirements

1. **Dynamic Rendering**: Map over the `registrationSchema` and render the appropriate input type (`text`, `email`, `select`, or `checkbox`).
2. **State Management**: Use a single state object to manage all form field values.
3. **Validation**:
   - Validate fields on change or on submit using the `validation` function provided in the schema.
   - Display error messages below each field.
4. **Submission**: Prevent default form submission and log the valid form data to the console.

## Constraints

- Do not use external form libraries like Formik or React Hook Form.
- Ensure the checkbox handles the `checked` attribute instead of `value`.
- Implement a reusable `FormField` component.

## Schema Format

```javascript
{
  name: string,
  label: string,
  type: string,
  options?: string[], // only for select
  validation?: (value) => boolean | string
}
```

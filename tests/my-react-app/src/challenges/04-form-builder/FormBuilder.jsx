import React, { useState } from 'react';
// import { registrationSchema } from './formSchema';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Render a form field for each item in the schema.
 * 2. Manage the form state as an object { fieldName: value }.
 * 3. Implement validation logic using schema.validation functions.
 * 4. Show error messages and prevent submission if the form is invalid.
 */

const FormField = ({ config, value, error, onChange }) => {
  // TODO: Implement based on config.type (text, email, select, checkbox)
  return (
    <div className="field-group" style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block' }}>{config.label}</label>
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} />
      {error && <span style={{ color: 'red', fontSize: '0.8rem' }}>{error}</span>}
    </div>
  );
};

export default function FormBuilder() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Validate all fields
    console.log('Submitting:', formData);
  };

  const handleFieldChange = (name, value) => {
    // TODO: Update state and clear errors for this field
  };

  return (
    <div className="form-builder" style={{ padding: '20px', maxWidth: '400px' }}>
      <h1>Dynamic Registration</h1>
      <form onSubmit={handleSubmit}>
        {/* TODO: Map over registrationSchema */}
        
        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px' }}>
          Register
        </button>
      </form>

      <pre style={{ marginTop: '20px', background: '#eee', padding: '10px' }}>
        {JSON.stringify(formData, null, 2)}
      </pre>
    </div>
  );
}

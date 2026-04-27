import React, { useState } from 'react';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Implement a state object to track all form data across steps.
 * 2. Implement step-based rendering (Step 1, Step 2, Step 3).
 * 3. Add validation before allowing "Next".
 * 4. Show a final summary page.
 */

export default function CheckoutWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    zip: '',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', maxWidth: '400px' }}>
      <h2>Step {step} of 3</h2>
      
      {step === 1 && (
        <div>
          <h3>Personal Info</h3>
          <input 
            placeholder="Name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {/* TODO: Implement Step 2 and Step 3 */}

      <div style={{ marginTop: '20px' }}>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
}

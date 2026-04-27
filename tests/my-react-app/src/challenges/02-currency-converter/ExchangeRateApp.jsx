import React from 'react';

// TODO: Import services here
// import { getAvailableCurrencies, getExchangeRates } from './services';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Implement state in ExchangeRateMain to track amount, source currency, target currency, and rates.
 * 2. Use useEffect to fetch currencies on mount and rates when the source changes.
 * 3. Pass props to sub-components to make them functional.
 * 4. Display the calculated conversion result.
 */

const CurrencyInput = ({ value, onChange }) => {
  return (
    <div className="input-group">
      <label>Amount:</label>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
};

const CurrencySelect = ({ label, value, options, onChange }) => {
  return (
    <div className="select-group">
      <label>{label}:</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select Currency</option>
        {/* TODO: Map options to <option> tags */}
        <option value="stub">Stub Option</option>
      </select>
    </div>
  );
};

export default function ExchangeRateMain() {
  // TODO: Initialize state
  
  // TODO: Fetch available currencies on mount
  
  // TODO: Fetch rates when source currency changes
  
  return (
    <div className="converter-container" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '450px' }}>
      <h2>Exchange Rate Converter</h2>
      
      <CurrencyInput 
        value={1} 
        onChange={(val) => console.log('Amount changed:', val)} 
      />
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <CurrencySelect 
          label="From" 
          value="" 
          options={[]} 
          onChange={(val) => console.log('Source changed:', val)} 
        />
        
        <CurrencySelect 
          label="To" 
          value="" 
          options={[]} 
          onChange={(val) => console.log('Target changed:', val)} 
        />
      </div>

      <div className="result-display" style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', textAlign: 'center', fontSize: '1.2rem' }}>
        {/* TODO: Display dynamic result */}
        <p>1 USD is equivalent to 0.89 CHF</p>
      </div>
    </div>
  );
}

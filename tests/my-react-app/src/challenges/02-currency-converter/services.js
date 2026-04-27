/**
 * MOCK SERVICES FOR CURRENCY CONVERTER
 */

const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CHF', 'JPY', 
  'CAD', 'AUD', 'CNY', 'INR', 'BRL', 
  'ZAR', 'NZD', 'MXN'
];

/**
 * Returns a list of supported currency codes.
 * @returns {Promise<string[]>}
 */
export const getAvailableCurrencies = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(CURRENCIES), 400);
  });
};

/**
 * Returns mock exchange rates for a given base currency.
 * Note: These are static mock rates.
 * @param {string} baseCurrency 
 * @returns {Promise<Object>}
 */
export const getExchangeRates = (baseCurrency) => {
  // Base values relative to USD
  const baseToUsd = {
    USD: 1, EUR: 0.92, GBP: 0.79, CHF: 0.89, JPY: 151.2, 
    CAD: 1.36, AUD: 1.53, CNY: 7.23, INR: 83.3, BRL: 5.07,
    ZAR: 18.8, NZD: 1.67, MXN: 16.5
  };

  const usdValue = 1 / baseToUsd[baseCurrency];
  
  // Calculate rates relative to the requested base
  const rates = {};
  Object.keys(baseToUsd).forEach(code => {
    rates[code] = baseToUsd[code] * usdValue;
  });

  return new Promise((resolve) => {
    setTimeout(() => resolve(rates), 500);
  });
};

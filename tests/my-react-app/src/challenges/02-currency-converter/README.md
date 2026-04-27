# Challenge 2: Exchange Rate Converter (Mid - JSX)

## Goal
Build a functional currency converter that fetches data from mock services.

## Requirements
1. **Component Architecture**: The application is split into 3 main parts:
   - `ExchangeRateMain`: The parent component managing the state.
   - `CurrencyInput`: A wrapper around a numeric input.
   - `CurrencySelect`: A reusable dropdown for selecting currencies.
2. **Data Fetching**: 
   - Fetch the list of available currencies on mount using `getAvailableCurrencies()`.
   - Fetch exchange rates using `getExchangeRates(base)` whenever the **source** currency changes.
3. **Conversion Logic**:
   - Calculate the conversion based on the amount entered.
   - Display the result in the format: `1 [SOURCE] is equivalent to [RATE] [TARGET]`.
4. **State Management**: Lift the state up to the `ExchangeRateMain` component so all sub-components are synchronized.

## Constraints
- The sub-components (`CurrencyInput`, `CurrencySelect`) should be "dumb" (stateless) and receive their values/handlers via props.
- You must manually import the services from `./services`.
- Handle the case where data is still loading.

## Mock Services
Import from `./services`:
- `getAvailableCurrencies()`: Returns `Promise<string[]>`.
- `getExchangeRates(baseCurrency)`: Returns `Promise<Object>` where keys are currency codes.

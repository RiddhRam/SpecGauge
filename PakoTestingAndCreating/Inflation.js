// Initial predicted MSRP
const MSRP = 263000;

// from 2024 - 2000
const inflationRates = [
  -0.031, -0.04, -0.074, -0.045, -0.012, -0.018, -0.024, -0.021, -0.012, -0.001,
  -0.016, -0.014, -0.02, -0.031, -0.016, 0.004, -0.037, -0.028, -0.031, -0.033,
  -0.026, -0.022, -0.016, -0.027,
];

// Prod year of vehicle
const prodYear = 2014;

// This will be the inflation adjusted msrp
let adjustedMSRP = MSRP;

// age of the vehicle
const time = 2024 - prodYear;

for (let i = 0; i != time; i++) {
  adjustedMSRP -= Math.abs(adjustedMSRP * inflationRates[i]);
}

// Adjustment 2
const fast = -0.125;
// Adjustment 2
// Adjustment 1
const somewhatFast = -0.105;
const normal = -0.095;
// Adjustment 1
// Good
const reputable = -0.075;
const reliable = -0.06;
const reputableSports = -0.055;
const inBetweenCars = -0.045;
const expensiveSport = -0.0375;
const superCar = -0.0325;
// Good

const reliableMotorCycle = -0.075;
const reputableMotorCycle = -0.06;
const expensiveSportMotorCycle = -0.05;
const superMotorCycle = -0.03;

const carsAveragePrices = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  24596.49306,
  24568.04833,
  24499.73456,
  23629.92042,
  26551.32829,
  35249.10294,
  34998.1869,
  31601.678,
  29804.43696,
  28069.02268,
  26335.33643,
  26434.31044,
  26533.18701,
  26631.96533,
  26730.64605,
  26829.22803,
  26927.71208,
  27026.09842,
  27124.38395,
  27222.57373,
  27320.66564,
  27706.09402,
  28091.13666,
  28475.79633,
  28860.07368,
  29243.96935,
  29627.4796,
  30010.60948,
  30393.35726,
  30775.72255,
  31157.70719,
  31539.31261,
  31920.53863,
  32301.38433,
  32681.85482,
  33061.94786,
  32613.79568,
  32166.10259,
  31718.85731,
];

const carsBrandValues = [
  { label: "Alfa Romeo", value: reputable },
  { label: "Alpine", value: inBetweenCars },
  { label: "Aston Martin", value: reputableSports },
  { label: "Audi", value: reputable },
  { label: "Audi RS-Series", value: -0.065 },
  { label: "Bentley", value: somewhatFast },
  { label: "BMW", value: -0.11 },
  { label: "BMW M-Series", value: -0.06 },
  { label: "BMW Motorcycle", value: expensiveSportMotorCycle },
  { label: "Bugatti", value: superCar },
  { label: "Buick", value: normal },
  { label: "BYD", value: normal },
  { label: "Cadillac", value: normal },
  { label: "Chevrolet", value: normal },
  { label: "Chevrolet Corvette", value: reputable },
  { label: "Chrysler", value: normal },
  { label: "Citroen", value: fast },
  { label: "Daewoo", value: normal },
  { label: "Dodge", value: -0.08 },
  { label: "Ducati", value: reliableMotorCycle },
  { label: "Ferrari", value: superCar },
  { label: "Fiat", value: fast },
  { label: "Fisker", value: fast },
  { label: "Ford", value: reputable },
  { label: "Genesis", value: normal },
  { label: "GMC", value: normal },
  { label: "Harley-Davidson", value: expensiveSportMotorCycle },
  { label: "Hennessey", value: superCar },
  { label: "Honda", value: reliable },
  { label: "Honda Motorcycle", value: superMotorCycle },
  { label: "Hummer", value: fast },
  { label: "Hyundai", value: normal },
  { label: "INEOS", value: fast },
  { label: "Infiniti", value: -0.15 },
  { label: "Isuzu", value: normal },
  { label: "Jaguar", value: fast },
  { label: "Jeep", value: normal },
  { label: "Karma", value: normal },
  { label: "Kawasaki", value: expensiveSportMotorCycle },
  { label: "Kia", value: normal },
  { label: "Koenigsegg", value: superCar },
  { label: "KTM", value: -0.08 },
  { label: "Lamborghini", value: superCar },
  { label: "Land Rover", value: normal },
  { label: "Lexus", value: -0.065 },
  { label: "Lincoln", value: normal },
  { label: "Lotus", value: normal },
  { label: "Lucid", value: normal },
  { label: "Maserati", value: fast },
  { label: "Maybach", value: superCar },
  { label: "Mazda", value: reliable },
  { label: "McLaren", value: expensiveSport },
  { label: "Mercedes-AMG", value: -0.07 },
  { label: "Mercedes-Benz", value: reputable },
  { label: "Mercury", value: normal },
  { label: "Mini", value: normal },
  { label: "Mitsubishi", value: reliable },
  { label: "Nissan", value: reputableSports },
  { label: "Oldsmobile", value: normal },
  { label: "Opel", value: normal },
  { label: "Pagani", value: superCar },
  { label: "Panoz", value: normal },
  { label: "Peugeot", value: normal },
  { label: "Plymouth", value: normal },
  { label: "Polestar", value: normal },
  { label: "Pontiac", value: normal },
  { label: "Porsche", value: -0.05 },
  { label: "RAM", value: normal },
  { label: "Renault", value: normal },
  { label: "Rimac", value: superCar },
  { label: "Rivian", value: normal },
  { label: "Rolls-Royce", value: reputable },
  { label: "Saab", value: normal },
  { label: "Saturn", value: normal },
  { label: "Scion", value: normal },
  { label: "Shelby", value: reputable },
  { label: "Smart", value: fast },
  { label: "Spyker", value: normal },
  { label: "Subaru", value: -0.07 },
  { label: "Suzuki", value: normal },
  { label: "Suzuki Motorcycle", value: reputableMotorCycle },
  { label: "Tata", value: normal },
  { label: "Tesla", value: reputable },
  { label: "Toyota", value: reliable },
  { label: "Triumph", value: expensiveSportMotorCycle },
  { label: "VinFast", value: fast },
  { label: "Volkswagen", value: normal },
  { label: "Volvo", value: reliable },
  { label: "Xiaomi", value: fast },
  { label: "Yamaha", value: expensiveSportMotorCycle },
];

// first parameter is name of option
// second parameter is default value
// third parameter is starting year, value lower than 2000 means to add that many years to vehicle production year
// fourth parameter is rate change after the third parameter year, 100 means the opposite of vehicle's original rate of change
// PUT ANY FIXED RATE CHANGES (anything above 100) AT THE END. FIXED RATE CHANGES ARE DIVIDED BY 10000
const carsAdditionalOptions = [
  ["Gasoline/Diesel", true, 2035, 0.005],
  ["Collectible", false, 10, 300],
];

export { carsAveragePrices, carsBrandValues, carsAdditionalOptions };

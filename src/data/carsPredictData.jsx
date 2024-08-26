// Adjustment 2
const fast = -0.135;
// Adjustment 2
// Adjustment 1
const somewhatFast = -0.105;
const normal = -0.0975;
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
  { label: "Alfa Romeo", value: reputable, reverseValue: reputable + 0.01 },
  { label: "Alpine", value: inBetweenCars, reverseValue: inBetweenCars },
  {
    label: "Aston Martin",
    value: reputableSports,
    reverseValue: reputableSports,
  },
  { label: "Audi RS-Series", value: -0.075, reverseValue: -0.075 },
  { label: "Audi", value: normal - 0.02, reverseValue: normal },
  { label: "Bentley", value: somewhatFast, reverseValue: somewhatFast - 0.01 },
  { label: "BMW M-Series", value: -0.08, reverseValue: -0.085 },
  {
    label: "BMW Motorcycle",
    value: expensiveSportMotorCycle,
    reverseValue: expensiveSportMotorCycle,
  },
  { label: "BMW", value: -0.095, reverseValue: -0.095 },
  { label: "Bugatti", value: superCar, reverseValue: superCar },
  {
    label: "Buick",
    value: normal,
    reverseValue: normal - 0.015,
  },
  { label: "BYD", value: normal, reverseValue: normal - 0.015 },
  { label: "Cadillac", value: normal, reverseValue: normal - 0.015 },
  {
    label: "Chevrolet Corvette",
    value: reputable,
    reverseValue: reputable + 0.01,
  },
  { label: "Chevrolet", value: normal, reverseValue: normal - 0.015 },
  { label: "Chrysler", value: normal, reverseValue: normal - 0.015 },
  { label: "Citroen", value: fast, reverseValue: fast + 0.01 },
  { label: "Daewoo", value: normal, reverseValue: normal - 0.015 },
  { label: "Dodge", value: -0.08, reverseValue: -0.08 },
  {
    label: "Ducati",
    value: reliableMotorCycle,
    reverseValue: reliableMotorCycle,
  },
  { label: "Ferrari", value: superCar, reverseValue: superCar },
  { label: "Fiat", value: fast, reverseValue: fast - 0.01 },
  { label: "Fisker", value: fast, reverseValue: fast + 0.01 },
  { label: "Ford", value: reputable, reverseValue: reputable + 0.01 },
  { label: "Genesis", value: normal, reverseValue: normal - 0.015 },
  { label: "GMC", value: normal, reverseValue: normal - 0.015 },
  {
    label: "Harley-Davidson",
    value: expensiveSportMotorCycle,
    reverseValue: expensiveSportMotorCycle,
  },
  { label: "Hennessey", value: superCar, reverseValue: superCar },
  {
    label: "Honda Motorcycle",
    value: superMotorCycle,
    reverseValue: superMotorCycle,
  },
  { label: "Honda", value: reliable, reverseValue: reliable - 0.0005 },
  { label: "Hummer", value: fast, reverseValue: fast + 0.01 },
  { label: "Hyundai", value: normal, reverseValue: normal - 0.015 },
  { label: "INEOS", value: fast, reverseValue: fast + 0.01 },
  {
    label: "Infiniti",
    value: fast,
    reverseValue: fast + 0.01,
  },
  { label: "Isuzu", value: normal, reverseValue: normal - 0.015 },
  { label: "Jaguar", value: fast, reverseValue: fast + 0.01 },
  { label: "Jeep", value: normal, reverseValue: normal - 0.015 },
  { label: "Karma", value: normal, reverseValue: normal - 0.015 },
  {
    label: "Kawasaki",
    value: expensiveSportMotorCycle,
    reverseValue: expensiveSportMotorCycle,
  },
  { label: "Kia", value: normal, reverseValue: normal - 0.015 },
  { label: "Koenigsegg", value: superCar, reverseValue: superCar },
  {
    label: "KTM Motorcycle",
    value: reliableMotorCycle,
    reverseValue: reliableMotorCycle,
  },
  { label: "KTM", value: -0.07, reverseValue: -0.07 },
  { label: "Lamborghini", value: superCar, reverseValue: superCar },
  { label: "Land Rover", value: normal, reverseValue: normal - 0.015 },
  { label: "Lexus", value: -0.065, reverseValue: -0.065 },
  { label: "Lincoln", value: normal, reverseValue: normal - 0.015 },
  { label: "Lotus", value: normal, reverseValue: normal - 0.015 },
  { label: "Lucid", value: normal, reverseValue: normal - 0.015 },
  { label: "Maserati", value: fast + 0.01 },
  { label: "Maybach", value: superCar, reverseValue: superCar },
  { label: "Mazda", value: reliable, reverseValue: reliable - 0.005 },
  { label: "McLaren", value: superCar, reverseValue: superCar },
  { label: "Mercedes-AMG", value: -0.09, reverseValue: -0.09 },
  { label: "Mercedes-Benz", value: -0.0925, reverseValue: -0.0925 },
  { label: "Mercury", value: normal, reverseValue: normal - 0.015 },
  { label: "Mini", value: normal, reverseValue: normal - 0.015 },
  { label: "Mitsubishi", value: reliable, reverseValue: reliable - 0.005 },
  {
    label: "Nissan",
    value: reputableSports,
    reverseValue: reputableSports - 0.015,
  },
  { label: "Oldsmobile", value: normal, reverseValue: normal - 0.015 },
  { label: "Opel", value: normal, reverseValue: normal - 0.015 },
  { label: "Pagani", value: superCar, reverseValue: superCar },
  { label: "Panoz", value: normal, reverseValue: normal - 0.015 },
  { label: "Peugeot", value: normal, reverseValue: normal - 0.015 },
  { label: "Plymouth", value: normal, reverseValue: normal - 0.015 },
  { label: "Polestar", value: normal, reverseValue: normal - 0.015 },
  { label: "Pontiac", value: normal, reverseValue: normal - 0.015 },
  { label: "Porsche", value: -0.045, reverseValue: -0.045 },
  { label: "RAM", value: normal, reverseValue: normal - 0.015 },
  { label: "Renault", value: normal, reverseValue: normal - 0.015 },
  { label: "Rimac", value: superCar, reverseValue: superCar },
  { label: "Rivian", value: normal, reverseValue: normal - 0.015 },
  { label: "Rolls-Royce", value: reputable, reverseValue: reputable + 0.01 },
  { label: "Saab", value: normal, reverseValue: normal - 0.015 },
  { label: "Saturn", value: normal, reverseValue: normal - 0.015 },
  { label: "Scion", value: normal, reverseValue: normal - 0.015 },
  { label: "Shelby", value: reputable, reverseValue: reputable + 0.01 },
  { label: "Smart", value: fast, reverseValue: fast + 0.01 },
  { label: "Spyker", value: normal, reverseValue: normal - 0.015 },
  { label: "Subaru", value: -0.07, reverseValue: -0.07 },
  {
    label: "Suzuki Motorcycle",
    value: reputableMotorCycle,
    reverseValue: reputableMotorCycle,
  },
  { label: "Suzuki", value: normal, reverseValue: normal - 0.015 },
  { label: "Tata", value: normal, reverseValue: normal - 0.015 },
  { label: "Tesla", value: reputable, reverseValue: reputable + 0.01 },
  { label: "Toyota", value: reliable, reverseValue: reliable - 0.005 },
  {
    label: "Triumph",
    value: expensiveSportMotorCycle,
    reverseValue: expensiveSportMotorCycle,
  },
  { label: "VinFast", value: fast, reverseValue: fast + 0.01 },
  { label: "Volkswagen", value: normal, reverseValue: normal - 0.015 },
  { label: "Volvo", value: reliable, reverseValue: reliable - 0.005 },
  { label: "Xiaomi", value: fast, reverseValue: fast + 0.01 },
  {
    label: "Yamaha",
    value: expensiveSportMotorCycle,
    reverseValue: expensiveSportMotorCycle,
  },
];

// first parameter is name of option
// second parameter is default value
// third parameter is starting year, value lower than 2000 means to add that many years to vehicle production year
// fourth parameter is rate change after the third parameter year, 100 means the opposite of vehicle's original rate of change
// PUT ANY FIXED RATE CHANGES (anything above 100) AT THE END. FIXED RATE CHANGES ARE DIVIDED BY 10000
const carsAdditionalOptions = [
  ["Gasoline/Diesel", true, 2035, 0.005],
  ["Collectible", false, 10, 0.13],
];

export { carsAveragePrices, carsBrandValues, carsAdditionalOptions };

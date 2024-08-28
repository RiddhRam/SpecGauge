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
  {
    label: "Alfa Romeo",
    value: [[0, reputable]],
    reverseValue: reputable + 0.01,
  },
  { label: "Alpine", value: [[0, inBetweenCars]] },
  {
    label: "Aston Martin",
    value: [[0, reputableSports]],
  },
  { label: "Audi RS-Series", value: [[0, -0.075]] },
  { label: "Audi", value: [[0, normal - 0.02]] },
  {
    label: "Bentley",
    value: [[0, somewhatFast]],
  },
  {
    label: "BMW M-Series",
    value: [
      [0, -0.08],
      [157000, -0.1],
    ],
  },
  {
    label: "BMW Motorcycle",
    value: [[0, expensiveSportMotorCycle]],
  },
  { label: "BMW", value: [[0, -0.095]] },
  { label: "Bugatti", value: [[0, superCar]] },
  {
    label: "Buick",
    value: [[0, normal]],
  },
  { label: "BYD", value: [[0, normal]] },
  { label: "Cadillac", value: [[0, normal]] },
  {
    label: "Chevrolet Corvette",
    value: [[0, reputable]],
  },
  { label: "Chevrolet", value: [[0, normal]] },
  { label: "Chrysler", value: [[0, normal]] },
  { label: "Citroen", value: [[0, fast]] },
  { label: "Daewoo", value: [[0, normal]] },
  {
    label: "Dodge",
    value: [
      [0, -0.08],
      [140000, -0.038],
    ],
  },
  {
    label: "Ducati",
    value: [[0, reliableMotorCycle]],
  },
  { label: "Ferrari", value: [[0, superCar]] },
  { label: "Fiat", value: [[0, fast - 0.005]] },
  { label: "Fisker", value: [[0, fast]] },
  { label: "Ford", value: [[0, reputable]] },
  { label: "Genesis", value: [[0, normal]] },
  { label: "GMC", value: [[0, normal]] },
  {
    label: "Harley-Davidson",
    value: [[0, expensiveSportMotorCycle]],
  },
  { label: "Hennessey", value: [[0, superCar]] },
  {
    label: "Honda Motorcycle",
    value: [[0, superMotorCycle]],
    reverseValue: superMotorCycle,
  },
  { label: "Honda", value: [[0, reliable]], reverseValue: reliable - 0.0005 },
  { label: "Hummer", value: [[0, fast]], reverseValue: fast + 0.01 },
  { label: "Hyundai", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "INEOS", value: [[0, fast]], reverseValue: fast + 0.01 },
  {
    label: "Infiniti",
    value: [[0, fast]],
    reverseValue: fast + 0.01,
  },
  { label: "Isuzu", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Jaguar", value: [[0, fast]] },
  { label: "Jeep", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Karma", value: [[0, normal]], reverseValue: normal - 0.015 },
  {
    label: "Kawasaki",
    value: [[0, expensiveSportMotorCycle]],
    reverseValue: expensiveSportMotorCycle,
  },
  { label: "Kia", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Koenigsegg", value: [[0, superCar]], reverseValue: superCar },
  {
    label: "KTM Motorcycle",
    value: [[0, reliableMotorCycle]],
    reverseValue: reliableMotorCycle,
  },
  { label: "KTM", value: [[0, -0.05]], reverseValue: -0.07 },
  { label: "Lamborghini", value: [[0, superCar]], reverseValue: superCar },
  { label: "Land Rover", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Lexus", value: [[0, -0.065]], reverseValue: -0.065 },
  { label: "Lincoln", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Lotus", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Lucid", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Maserati", value: [[0, fast + 0.1]], reverseValue: fast },
  { label: "Maybach", value: [[0, superCar]], reverseValue: superCar },
  { label: "Mazda", value: [[0, reliable]] },
  { label: "McLaren", value: [[0, superCar]] },
  { label: "Mercedes-AMG", value: [[0, -0.09]] },
  { label: "Mercedes-Benz", value: [[0, -0.0925]] },
  { label: "Mercury", value: [[0, normal]] },
  { label: "Mini", value: [[0, normal]] },
  {
    label: "Mitsubishi",
    value: [[0, reliable]],
    reverseValue: reliable - 0.005,
  },
  {
    label: "Nissan",
    value: [[0, reputableSports]],
    reverseValue: reputableSports - 0.015,
  },
  { label: "Oldsmobile", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Opel", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Pagani", value: [[0, superCar]], reverseValue: superCar },
  { label: "Panoz", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Peugeot", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Plymouth", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Polestar", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Pontiac", value: [[0, normal]], reverseValue: normal - 0.015 },
  {
    label: "Porsche",
    value: [
      [0, -0.125],
      [125000, -0.08],
      [135000, -0.045],
    ],
    reverseValue: -0.045,
  },
  { label: "RAM", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Renault", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Rimac", value: [[0, superCar]], reverseValue: superCar },
  { label: "Rivian", value: [[0, normal]], reverseValue: normal - 0.015 },
  {
    label: "Rolls-Royce",
    value: [[0, reputable]],
    reverseValue: reputable + 0.01,
  },
  { label: "Saab", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Saturn", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Scion", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Shelby", value: [[0, reputable]], reverseValue: reputable + 0.01 },
  { label: "Smart", value: [[0, fast]], reverseValue: fast + 0.01 },
  { label: "Spyker", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Subaru", value: [[0, -0.07]], reverseValue: -0.07 },
  {
    label: "Suzuki Motorcycle",
    value: [[0, reputableMotorCycle]],
    reverseValue: reputableMotorCycle,
  },
  { label: "Suzuki", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Tata", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Tesla", value: [[0, reputable]], reverseValue: reputable + 0.01 },
  { label: "Toyota", value: [[0, reliable]], reverseValue: reliable - 0.005 },
  {
    label: "Triumph",
    value: [[0, expensiveSportMotorCycle]],
    reverseValue: expensiveSportMotorCycle,
  },
  { label: "VinFast", value: [[0, fast]], reverseValue: fast + 0.01 },
  { label: "Volkswagen", value: [[0, normal]], reverseValue: normal - 0.015 },
  { label: "Volvo", value: [[0, reliable]], reverseValue: reliable - 0.005 },
  { label: "Xiaomi", value: [[0, fast]], reverseValue: fast + 0.01 },
  {
    label: "Yamaha",
    value: [[0, expensiveSportMotorCycle]],
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

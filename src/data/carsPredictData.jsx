// Adjustment 2
const fast = -0.135;
// Adjustment 2
// Adjustment 1
const somewhatFast = -0.105;
const normal = -0.0975;
// Adjustment 1
// Good
const reputable = -0.075;
const reliable = -0.07;
const reputableSports = -0.055;
const inBetweenCars = -0.045;
const expensiveSport = -0.04;
const superCar = -0.035;
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
];

const carsBrandValues = [
  {
    label: "Alfa Romeo",
    value: [[0, reputable + 0.0125]],
  },
  { label: "Alpine", value: [[0, inBetweenCars]] },
  {
    label: "Aston Martin",
    value: [[0, reputableSports - 0.02]],
  },
  { label: "Audi RS-Series", value: [[0, reputable - 0.01]] },
  { label: "Audi", value: [[0, somewhatFast - 0.01]] },
  {
    label: "Bentley",
    value: [[0, somewhatFast]],
  },
  {
    label: "BMW M-Series",
    value: [
      [0, -0.08],
      [157000, -0.095],
    ],
  },
  {
    label: "BMW Motorcycle",
    value: [[0, expensiveSportMotorCycle]],
  },
  { label: "BMW", value: [[0, normal - 0.02]] },
  { label: "Bugatti", value: [[0, superCar]] },
  {
    label: "Buick",
    value: [[0, normal]],
  },
  { label: "BYD", value: [[0, normal]] },
  { label: "Cadillac", value: [[0, normal - 0.01]] },
  {
    label: "Chevrolet Corvette",
    value: [
      [0, reputableSports - 0.01],
      [1000000, superCar],
    ],
  },
  { label: "Chevrolet", value: [[0, normal]] },
  { label: "Chrysler", value: [[0, normal]] },
  { label: "Citroen", value: [[0, fast + 0.01]] },
  { label: "Daewoo", value: [[0, normal]] },
  {
    label: "Dodge",
    value: [
      [0, -0.08],
      [150000, -0.035],
    ],
  },
  {
    label: "Ducati",
    value: [[0, reliableMotorCycle]],
  },
  { label: "Ferrari", value: [[0, superCar - 0.01]] },
  { label: "Fiat", value: [[0, fast - 0.01]] },
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
  },
  { label: "Honda", value: [[0, reliable]] },
  { label: "Hummer", value: [[0, fast]] },
  { label: "Hyundai", value: [[0, normal]] },
  { label: "INEOS", value: [[0, fast]] },
  {
    label: "Infiniti",
    value: [[0, fast]],
  },
  { label: "Isuzu", value: [[0, normal]] },
  { label: "Jaguar", value: [[0, fast]] },
  { label: "Jeep", value: [[0, normal]] },
  { label: "Karma", value: [[0, normal]] },
  {
    label: "Kawasaki",
    value: [[0, expensiveSportMotorCycle]],
  },
  { label: "Kia", value: [[0, normal]] },
  { label: "Koenigsegg", value: [[0, superCar]] },
  {
    label: "KTM Motorcycle",
    value: [[0, reliableMotorCycle]],
  },
  { label: "KTM", value: [[0, -0.05]] },
  {
    label: "Lamborghini",
    value: [[0, superCar]],
  },
  { label: "Land Rover", value: [[0, normal]] },
  {
    label: "Lexus",
    value: [
      [0, -0.1],
      [85000, -0.065],
      [250000, 0.03675],
    ],
  },
  { label: "Lincoln", value: [[0, normal]] },
  { label: "Lotus", value: [[0, normal]] },
  { label: "Lucid", value: [[0, normal]] },
  { label: "Maserati", value: [[0, fast - 0.005]] },
  { label: "Maybach", value: [[0, superCar]] },
  { label: "Mazda", value: [[0, reliable]] },
  {
    label: "McLaren",
    value: [
      [0, reputableSports - 0.01],
      [900000, superCar],
    ],
  },
  {
    label: "Mercedes-AMG",
    value: [
      [0, -0.08],
      [145000, -0.065],
    ],
  },
  {
    label: "Mercedes-Benz",
    value: [
      [0, -0.135],
      [145000, -0.065],
    ],
  },
  { label: "Mercury", value: [[0, normal]] },
  { label: "Mini", value: [[0, normal]] },
  {
    label: "Mitsubishi",
    value: [[0, reliable]],
  },
  {
    label: "Nissan",
    value: [[0, reputableSports]],
  },
  { label: "Oldsmobile", value: [[0, normal]] },
  { label: "Opel", value: [[0, normal]] },
  { label: "Pagani", value: [[0, superCar]] },
  { label: "Panoz", value: [[0, normal]] },
  { label: "Peugeot", value: [[0, normal]] },
  { label: "Plymouth", value: [[0, normal]] },
  { label: "Polestar", value: [[0, normal]] },
  { label: "Pontiac", value: [[0, normal]] },
  {
    label: "Porsche",
    value: [
      [0, -0.12],
      [130000, -0.085],
      [145000, -0.05],
    ],
  },
  { label: "RAM", value: [[0, normal]] },
  { label: "Renault", value: [[0, normal]] },
  { label: "Rimac", value: [[0, superCar]] },
  { label: "Rivian", value: [[0, normal]] },
  {
    label: "Rolls-Royce",
    value: [[0, reputable]],
  },
  { label: "Saab", value: [[0, normal]] },
  { label: "Saturn", value: [[0, normal]] },
  { label: "Scion", value: [[0, normal]] },
  { label: "Shelby", value: [[0, reputable]] },
  { label: "Smart", value: [[0, fast]] },
  { label: "Spyker", value: [[0, normal]] },
  { label: "Subaru", value: [[0, -0.07]] },
  {
    label: "Suzuki Motorcycle",
    value: [[0, reputableMotorCycle]],
  },
  { label: "Suzuki", value: [[0, normal]] },
  { label: "Tata", value: [[0, normal]] },
  { label: "Tesla", value: [[0, reputable]] },
  {
    label: "Toyota",
    value: [
      [0, reliable + 0.01],
      [65000, inBetweenCars],
    ],
  },
  {
    label: "Triumph",
    value: [[0, expensiveSportMotorCycle]],
  },
  { label: "VinFast", value: [[0, fast]] },
  { label: "Volkswagen", value: [[0, normal]] },
  { label: "Volvo", value: [[0, reliable - 0.01]] },
  { label: "Xiaomi", value: [[0, fast]] },
  {
    label: "Yamaha",
    value: [[0, expensiveSportMotorCycle]],
  },
];

// first parameter is name of option
// second parameter is default value
// third parameter is starting year, value lower than 2000 means to add that many years to vehicle production year
// fourth parameter is rate change after the third parameter year
// fifth parameter is whether or not the rate grows as time goes on, it's multiplied by each year

const carsAdditionalOptions = [
  ["Gasoline/Diesel", true, 2035, 0.005, false],
  ["Collectible", false, 2, 0.007, true],
];

export { carsAveragePrices, carsBrandValues, carsAdditionalOptions };

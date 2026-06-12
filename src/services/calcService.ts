export type BasicOperator = '+' | '-' | '*' | '/' | '%' | '^';

export const calculateBasic = (x: number, y: number, operator: BasicOperator) => {
  if (operator === '+') return x + y;
  if (operator === '-') return x - y;
  if (operator === '*') return x * y;
  if (operator === '/') return y !== 0 ? x / y : NaN;
  if (operator === '%') return (x * y) / 100;
  if (operator === '^') return Math.pow(x, y);
  return NaN;
};

export const calculateScientific = (value: number, operation: string, exponent = 0) => {
  switch (operation) {
    case 'sin':
      return Math.sin(value);
    case 'cos':
      return Math.cos(value);
    case 'tan':
      return Math.tan(value);
    case 'log':
      return value > 0 ? Math.log10(value) : NaN;
    case 'ln':
      return value > 0 ? Math.log(value) : NaN;
    case 'sqrt':
      return value >= 0 ? Math.sqrt(value) : NaN;
    case 'factorial':
      return factorial(value);
    case 'power':
      return Math.pow(value, exponent);
    case 'exp':
      return Math.exp(value);
    case 'pi':
      return Math.PI * (Number.isFinite(value) ? value : 1);
    default:
      return NaN;
  }
};

export const factorial = (value: number) => {
  const n = Math.floor(value);
  if (n < 0 || n !== value) return NaN;
  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }
  return result;
};

export const calculateOhmsLaw = (method: 'voltage' | 'current' | 'resistance', values: Record<string, number>) => {
  switch (method) {
    case 'voltage':
      return values.current * values.resistance;
    case 'current':
      return values.voltage / values.resistance;
    case 'resistance':
      return values.voltage / values.current;
    default:
      return NaN;
  }
};

export const calculatePower = (voltage: number, current: number) => voltage * current;
export const calculateEnergy = (power: number, time: number) => power * time;

const lengthConversions: Record<string, number> = {
  meters: 1,
  kilometers: 0.001,
  miles: 0.000621371,
  feet: 3.28084,
  centimeters: 100,
  millimeters: 1000
};

const weightConversions: Record<string, number> = {
  kilograms: 1,
  grams: 1000,
  pounds: 2.20462,
  ounces: 35.274
};

const temperatureConverters: Record<string, (value: number) => number> = {
  celsius: (value) => value,
  fahrenheit: (value) => (value * 9) / 5 + 32,
  kelvin: (value) => value + 273.15
};

const areaConversions: Record<string, number> = {
  squareMeters: 1,
  squareKilometers: 0.000001,
  squareFeet: 10.7639,
  acres: 0.000247105
};

const volumeConversions: Record<string, number> = {
  liters: 1,
  milliliters: 1000,
  cubicMeters: 0.001,
  gallons: 0.264172
};

const speedConversions: Record<string, number> = {
  metersPerSecond: 1,
  kilometersPerHour: 3.6,
  milesPerHour: 2.23694,
  knots: 1.94384
};

export const convertUnit = (category: string, value: number, from: string, to: string) => {
  if (category === 'length') {
    return (value / lengthConversions[from]) * lengthConversions[to];
  }
  if (category === 'weight') {
    return (value / weightConversions[from]) * weightConversions[to];
  }
  if (category === 'temperature') {
    const celsius = from === 'celsius' ? value : from === 'fahrenheit' ? ((value - 32) * 5) / 9 : value - 273.15;
    return to === 'celsius' ? celsius : to === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius + 273.15;
  }
  if (category === 'area') {
    return (value / areaConversions[from]) * areaConversions[to];
  }
  if (category === 'volume') {
    return (value / volumeConversions[from]) * volumeConversions[to];
  }
  if (category === 'speed') {
    return (value / speedConversions[from]) * speedConversions[to];
  }
  return NaN;
};

export const calculateSemesterGpa = (grades: number[], credits: number[]) => {
  const totalCredits = credits.reduce((sum, credit) => sum + credit, 0);
  if (totalCredits === 0) return NaN;
  const points = grades.reduce((sum, grade, index) => sum + grade * credits[index], 0);
  return points / totalCredits;
};

export const calculateCgpa = (semesterGpas: number[], semesterCredits: number[]) => {
  const totalCredits = semesterCredits.reduce((sum, credit) => sum + credit, 0);
  if (totalCredits === 0) return NaN;
  const totalPoints = semesterGpas.reduce((sum, gpa, index) => sum + gpa * semesterCredits[index], 0);
  return totalPoints / totalCredits;
};

export const gradeToLetter = (gradePoint: number) => {
  if (gradePoint >= 3.7) return 'A';
  if (gradePoint >= 3.0) return 'B';
  if (gradePoint >= 2.0) return 'C';
  if (gradePoint >= 1.0) return 'D';
  return 'F';
};

export const calculateMean = (values: number[]) => {
  if (values.length === 0) return NaN;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const calculateMedian = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  if (count === 0) return NaN;
  const middle = Math.floor(count / 2);
  return count % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};

export const calculateMode = (values: number[]) => {
  const counts: Record<number, number> = {};
  values.forEach((value) => {
    counts[value] = (counts[value] || 0) + 1;
  });
  const maxCount = Math.max(...Object.values(counts));
  return Object.keys(counts)
    .map(Number)
    .filter((value) => counts[value] === maxCount);
};

export const calculateVariance = (values: number[]) => {
  const mean = calculateMean(values);
  if (values.length === 0 || Number.isNaN(mean)) return NaN;
  return values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
};

export const calculateStdDev = (values: number[]) => {
  const variance = calculateVariance(values);
  return Number.isNaN(variance) ? NaN : Math.sqrt(variance);
};

export const addMatrix2x2 = (a: number[][], b: number[][]) => [
  [a[0][0] + b[0][0], a[0][1] + b[0][1]],
  [a[1][0] + b[1][0], a[1][1] + b[1][1]]
];

export const subtractMatrix2x2 = (a: number[][], b: number[][]) => [
  [a[0][0] - b[0][0], a[0][1] - b[0][1]],
  [a[1][0] - b[1][0], a[1][1] - b[1][1]]
];

export const multiplyMatrix2x2 = (a: number[][], b: number[][]) => [
  [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
  [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]]
];

export function determinant2x2(matrix: number[][]): number;
export function determinant2x2(a: number, b: number, c: number, d: number): number;
export function determinant2x2(x: number[][] | number, y?: number, z?: number, w?: number): number {
  if (Array.isArray(x)) {
    return x[0][0] * x[1][1] - x[0][1] * x[1][0];
  }
  if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number' && typeof w === 'number') {
    return x * w - y * z;
  }
  return NaN;
}

export const convertLength = (value: number, toUnit: 'meters' | 'kilometers' | 'miles' | 'feet') => {
  if (toUnit === 'meters') return value;
  if (toUnit === 'kilometers') return value * 0.001;
  if (toUnit === 'miles') return value * 0.000621371;
  if (toUnit === 'feet') return value * 3.28084;
  return NaN;
};

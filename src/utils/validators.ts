export const parseNumber = (value: string) => {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : NaN;
};

export const isNumber = (value: string) => !Number.isNaN(parseNumber(value));

export const parseNumberArray = (value: string) =>
  value
    .split(/[,;\s]+/)
    .map((item) => parseNumber(item))
    .filter((item) => Number.isFinite(item));

export const numberListToString = (numbers: number[]) => numbers.join(', ');

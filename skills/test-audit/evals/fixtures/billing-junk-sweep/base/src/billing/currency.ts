const MINOR_DIGITS: Record<string, number> = {
  USD: 2,
  EUR: 2,
  AUD: 2,
  JPY: 0,
  KWD: 3,
};

function digitsFor(currency: string): number {
  const digits = MINOR_DIGITS[currency];
  if (digits === undefined) {
    throw new RangeError(`unsupported currency ${currency}`);
  }
  return digits;
}

export function toMinorUnits(amount: number, currency: string): number {
  return Math.round(amount * 10 ** digitsFor(currency));
}

export function formatMoney(minor: number, currency: string): string {
  const digits = digitsFor(currency);
  return `${(minor / 10 ** digits).toFixed(digits)} ${currency}`;
}

export function splitEvenly(totalMinor: number, parts: number): number[] {
  if (!Number.isInteger(parts) || parts < 1) {
    throw new RangeError("parts must be a positive whole number");
  }
  const share = Math.floor(totalMinor / parts);
  const remainder = totalMinor - share * parts;
  return Array.from({ length: parts }, (_, index) => (index < remainder ? share + 1 : share));
}

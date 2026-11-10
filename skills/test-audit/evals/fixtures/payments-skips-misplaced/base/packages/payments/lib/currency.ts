const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND"]);

export function minorDigits(currency: string): number {
  return ZERO_DECIMAL.has(currency) ? 0 : 2;
}

export function toMinor(amount: number, currency: string): number {
  return Math.round(amount * 10 ** minorDigits(currency));
}

export function fromMinor(minor: number, currency: string): number {
  return minor / 10 ** minorDigits(currency);
}

export function formatMinor(minor: number, currency: string): string {
  const digits = minorDigits(currency);
  return `${currency} ${fromMinor(minor, currency).toFixed(digits)}`;
}

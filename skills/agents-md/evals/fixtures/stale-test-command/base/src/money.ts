import rates from "./rates.json" with { type: "json" };

export type Currency = keyof typeof rates;

export interface Money {
  currency: Currency;
  minor: number;
}

export function money(currency: Currency, minor: number): Money {
  if (!Number.isInteger(minor)) {
    throw new RangeError(`minor amount must be an integer, got ${minor}`);
  }
  return { currency, minor };
}

export function add(left: Money, right: Money): Money {
  if (left.currency !== right.currency) {
    throw new TypeError(`cannot add ${left.currency} to ${right.currency}`);
  }
  return money(left.currency, left.minor + right.minor);
}

export function format(value: Money): string {
  const digits = rates[value.currency].minorUnits;
  const major = value.minor / 10 ** digits;
  return `${major.toFixed(digits)} ${value.currency}`;
}

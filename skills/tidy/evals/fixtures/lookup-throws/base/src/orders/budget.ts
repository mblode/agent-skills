const MONTHLY_LIMIT_CENTS = 2_500_000;

let reservedCents = 0;

export function reserve(cents: number): void {
  if (reservedCents + cents > MONTHLY_LIMIT_CENTS) {
    throw new Error(`purchase budget exceeded by ${reservedCents + cents - MONTHLY_LIMIT_CENTS} cents`);
  }
  reservedCents += cents;
}

export function release(cents: number): void {
  reservedCents = Math.max(0, reservedCents - cents);
}

export function reservedTotal(): number {
  return reservedCents;
}

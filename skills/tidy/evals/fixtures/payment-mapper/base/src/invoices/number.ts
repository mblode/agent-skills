export function invoiceNumber(year: number, sequence: number): string {
  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new RangeError(`invoice sequence must be a positive integer, got ${sequence}`);
  }
  return `INV-${year}-${String(sequence).padStart(5, "0")}`;
}

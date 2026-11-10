export type Carrier = "road" | "air" | "sea";

const CARRIER_PREFIX: Record<Carrier, string> = {
  road: "RD",
  air: "AR",
  sea: "SE",
};

const CODE_PATTERN = /^LF-(RD|AR|SE)-(\d{8})-(\d)$/;

function checkDigit(digits: string): number {
  let sum = 0;
  for (let index = 0; index < digits.length; index += 1) {
    sum += Number(digits[index]) * (index + 1);
  }
  return sum % 10;
}

export function formatTrackingCode(carrier: Carrier, sequence: number): string {
  if (!Number.isInteger(sequence) || sequence < 0 || sequence > 99_999_999) {
    throw new RangeError(`sequence ${sequence} does not fit in eight digits`);
  }
  const digits = String(sequence).padStart(8, "0");
  return `LF-${CARRIER_PREFIX[carrier]}-${digits}-${checkDigit(digits)}`;
}

export interface ParsedTrackingCode {
  carrier: Carrier;
  sequence: number;
}

export function parseTrackingCode(code: string): ParsedTrackingCode | null {
  const match = CODE_PATTERN.exec(code.trim().toUpperCase());
  if (!match) {
    return null;
  }
  const [, prefix, digits, check] = match;
  if (checkDigit(digits) !== Number(check)) {
    return null;
  }
  const carrier = (Object.keys(CARRIER_PREFIX) as Carrier[]).find((name) => CARRIER_PREFIX[name] === prefix);
  return carrier ? { carrier, sequence: Number(digits) } : null;
}

export function isValidTrackingCode(code: string): boolean {
  return parseTrackingCode(code) !== null;
}

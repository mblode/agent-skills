export type Zone = "local" | "regional" | "national" | "remote";

export interface Dimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export const ZONE_MULTIPLIER: Record<Zone, number> = {
  local: 1,
  regional: 1.35,
  national: 1.8,
  remote: 2.6,
};

const BASE_CENTS = 450;
const PER_KG_CENTS = 120;
const MIN_BILLABLE_KG = 0.5;
const VOLUMETRIC_DIVISOR = 5000;

let zoneCache = new Map<string, Zone>();

export function resetZoneCache(): void {
  zoneCache = new Map();
}

function lookupZone(postcode: string): Zone {
  const lead = postcode[0];
  if (lead === "2") {
    return "local";
  }
  if (lead === "3" || lead === "4") {
    return "regional";
  }
  if (lead === "0" || lead === "8" || lead === "9") {
    return "remote";
  }
  return "national";
}

export function zoneFor(postcode: string): Zone {
  if (!/^\d{4}$/.test(postcode)) {
    throw new RangeError(`"${postcode}" is not a four digit postcode`);
  }
  const cached = zoneCache.get(postcode);
  if (cached) {
    return cached;
  }
  const zone = lookupZone(postcode);
  zoneCache.set(postcode, zone);
  return zone;
}

export function billableWeight(weightKg: number, dims?: Dimensions): number {
  const volumetric = dims ? (dims.lengthCm * dims.widthCm * dims.heightCm) / VOLUMETRIC_DIVISOR : 0;
  const heaviest = Math.max(weightKg, volumetric, MIN_BILLABLE_KG);
  return Math.ceil(heaviest * 2) / 2;
}

export function rateCents(weightKg: number, zone: Zone, dims?: Dimensions): number {
  const billable = billableWeight(weightKg, dims);
  return Math.round((BASE_CENTS + PER_KG_CENTS * billable) * ZONE_MULTIPLIER[zone]);
}

export function fuelSurchargeCents(rate: number, percent: number): number {
  return Math.ceil((rate * percent) / 100);
}

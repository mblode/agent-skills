import { type Dimensions, type Zone, fuelSurchargeCents, rateCents, zoneFor } from "./rates.ts";

const FUEL_PERCENT = 8;

export interface QuoteRequest {
  weightKg: number;
  postcode: string;
  dims?: Dimensions;
}

export interface QuoteBody {
  zone: Zone;
  rateCents: number;
  fuelCents: number;
  totalCents: number;
}

export interface QuoteResponse {
  status: 200 | 422;
  body: QuoteBody | { error: string };
}

export interface QuoteDeps {
  rateCents: typeof rateCents;
  zoneFor: typeof zoneFor;
}

const defaultDeps: QuoteDeps = { rateCents, zoneFor };

export function quoteParcel(request: QuoteRequest, deps: QuoteDeps = defaultDeps): QuoteResponse {
  if (!(request.weightKg > 0)) {
    return { status: 422, body: { error: "weightKg must be greater than zero" } };
  }
  let zone: Zone;
  try {
    zone = deps.zoneFor(request.postcode);
  } catch {
    return { status: 422, body: { error: "postcode must be four digits" } };
  }
  const rate = deps.rateCents(request.weightKg, zone, request.dims);
  const fuel = fuelSurchargeCents(rate, FUEL_PERCENT);
  return { status: 200, body: { zone, rateCents: rate, fuelCents: fuel, totalCents: rate + fuel } };
}

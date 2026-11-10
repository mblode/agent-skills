import type { IncomingMessage, ServerResponse } from "node:http";
import { ulid } from "ulid";
import { send } from "../http.ts";

export interface QuoteRequest {
  originPostcode: string;
  destinationPostcode: string;
  weightGrams: number;
  supersedes?: string;
}

const RATE_PER_KG_KM_MICROS = 420;

async function readBody(request: IncomingMessage): Promise<QuoteRequest> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(chunk as Buffer);
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as QuoteRequest;
}

export async function createQuote(
  request: IncomingMessage,
  response: ServerResponse,
  distanceMetres: (origin: string, destination: string) => number,
): Promise<void> {
  const body = await readBody(request);
  if (!Number.isInteger(body.weightGrams) || body.weightGrams <= 0) {
    send(response, 422, { error: "weightGrams must be a positive integer" });
    return;
  }
  const metres = distanceMetres(body.originPostcode, body.destinationPostcode);
  const priceMicros = Math.round((body.weightGrams / 1000) * (metres / 1000) * RATE_PER_KG_KM_MICROS);
  send(response, 201, {
    id: ulid(),
    priceMicros,
    weightGrams: body.weightGrams,
    distanceMetres: metres,
    supersedes: body.supersedes ?? null,
  });
}

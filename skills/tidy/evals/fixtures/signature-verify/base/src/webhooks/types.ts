export interface WebhookRequest {
  rawBody: string;
  headers: Record<string, string | undefined>;
}

export interface WebhookResponse {
  status: number;
  body: string;
}

export interface CarrierEvent {
  id: string;
  type: string;
  payload: Record<string, unknown>;
}

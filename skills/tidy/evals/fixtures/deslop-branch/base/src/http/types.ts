export interface ApiRequest {
  userId: string;
  params: Record<string, string>;
  rawBody: string;
}

export interface ApiResponse {
  status: number;
  body: unknown;
}

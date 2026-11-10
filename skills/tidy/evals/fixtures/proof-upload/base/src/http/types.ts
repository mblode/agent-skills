export interface UploadedFile {
  filename: string;
  mimeType: "image/jpeg" | "image/png";
  bytes: Uint8Array;
}

export interface Request {
  method: string;
  path: string;
  params: Record<string, string>;
  headers: Record<string, string | undefined>;
  body: unknown;
  file?: UploadedFile;
}

export interface CourierRequest extends Request {
  courierId: string;
}

export interface Response {
  status: number;
  body: unknown;
}

export type Handler = (req: Request) => Promise<Response>;
export type CourierHandler = (req: CourierRequest) => Promise<Response>;

export interface Route {
  method: string;
  path: string;
  handler: Handler;
  upload?: boolean;
}

import { MAX_UPLOAD_BYTES } from "../config.ts";
import type { UploadedFile } from "./types.ts";

export class UploadRejected extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const JPEG = [0xff, 0xd8, 0xff];
const PNG = [0x89, 0x50, 0x4e, 0x47];

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte);
}

function sniff(bytes: Uint8Array): UploadedFile["mimeType"] | null {
  if (startsWith(bytes, JPEG)) return "image/jpeg";
  if (startsWith(bytes, PNG)) return "image/png";
  return null;
}

export function readUpload(headers: Record<string, string | undefined>, raw: Uint8Array): UploadedFile {
  if (raw.byteLength > MAX_UPLOAD_BYTES) {
    throw new UploadRejected(413, "upload is larger than 5 MB");
  }
  const mimeType = sniff(raw);
  if (!mimeType) {
    throw new UploadRejected(415, "only JPEG and PNG images are accepted");
  }
  const disposition = headers["content-disposition"] ?? "";
  const match = /filename="([^"]*)"/.exec(disposition);
  return { filename: match?.[1] ?? "upload", mimeType, bytes: raw };
}

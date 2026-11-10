import type { Digest, Transport } from "./types.ts";

export interface SendReport {
  delivered: boolean;
  attempts: number;
  error?: string;
}

export async function sendDigest(transport: Transport, recipient: string, digest: Digest): Promise<SendReport> {
  if (digest.lines.length === 0) {
    return { delivered: false, attempts: 0 };
  }
  const body = digest.lines.join("\n");
  let lastError = "";
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      await transport.deliver(recipient, body);
      return { delivered: true, attempts: attempt };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  return { delivered: false, attempts: 2, error: lastError };
}

const STORAGE_URL = process.env.RECEIPT_STORAGE_URL ?? "http://localhost:9000/receipts";

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export async function putObject(key: string, bytes: Uint8Array, contentType: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${STORAGE_URL}/${key}`, {
      method: "PUT",
      headers: { "content-type": contentType },
      body: bytes,
    });
  } catch (error) {
    throw new StorageError(`storage unreachable for ${key}: ${String(error)}`);
  }
  if (!response.ok) {
    throw new StorageError(`storage returned ${response.status} for ${key}`);
  }
}

import type { TempUpload } from "../uploads/temp.ts";
import { putObject } from "./storage.ts";

export interface SavedReceipt {
  receiptKey: string;
}

export async function saveReceipt(upload: TempUpload): Promise<SavedReceipt> {
  const receiptKey = `${upload.id}/${upload.filename}`;
  try {
    await putObject(receiptKey, upload.bytes, upload.contentType);
  } catch (error) {
    console.error(`receipt upload failed for ${upload.id}`, error);
  }
  return { receiptKey };
}

import type { TempUpload } from "../uploads/temp.ts";
import { putObject } from "./storage.ts";

export interface SavedReceipt {
  receiptKey: string;
}

export async function saveReceipt(upload: TempUpload): Promise<SavedReceipt> {
  const receiptKey = `${upload.id}/${upload.filename}`;
  await putObject(receiptKey, upload.bytes, upload.contentType);
  return { receiptKey };
}

export interface TempUpload {
  id: string;
  filename: string;
  contentType: string;
  bytes: Uint8Array;
}

const uploads = new Map<string, TempUpload>();

export function stashUpload(upload: TempUpload): void {
  uploads.set(upload.id, upload);
}

export function readUpload(id: string): TempUpload {
  const upload = uploads.get(id);
  if (!upload) {
    throw new Error(`upload ${id} has expired or was never received`);
  }
  return upload;
}

export function discardUpload(id: string): void {
  uploads.delete(id);
}

export function pendingUploads(): number {
  return uploads.size;
}

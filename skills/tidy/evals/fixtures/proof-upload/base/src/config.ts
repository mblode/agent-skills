export const SIGNATURE_ROOT = process.env.SIGNATURE_ROOT ?? "/var/lib/driftwood/signatures";
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const PORT = Number(process.env.PORT ?? 4100);

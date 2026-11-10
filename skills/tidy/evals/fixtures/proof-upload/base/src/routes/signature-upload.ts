import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { SIGNATURE_ROOT } from "../config.ts";
import type { CourierRequest, Response } from "../http/types.ts";
import { shipments } from "../shipments/store.ts";

export async function uploadSignature(req: CourierRequest): Promise<Response> {
  const file = req.file;
  if (!file) {
    return { status: 400, body: { error: "signature image is required" } };
  }
  const extension = file.mimeType === "image/png" ? "png" : "jpg";
  const target = join(SIGNATURE_ROOT, `${req.params.shipmentId}.${extension}`);
  await mkdir(SIGNATURE_ROOT, { recursive: true });
  await writeFile(target, file.bytes);
  await shipments.setSignature(req.params.shipmentId, target);
  return { status: 201, body: { stored: true } };
}

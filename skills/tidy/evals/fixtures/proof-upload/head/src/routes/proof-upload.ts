import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PROOF_ROOT } from "../config.ts";
import type { CourierRequest, Response } from "../http/types.ts";
import { shipments } from "../shipments/store.ts";

export async function uploadProof(req: CourierRequest): Promise<Response> {
  const file = req.file;
  if (!file) {
    return { status: 400, body: { error: "photo is required" } };
  }
  const directory = join(PROOF_ROOT, req.params.shipmentId);
  await mkdir(directory, { recursive: true });
  const target = join(directory, file.filename);
  await writeFile(target, file.bytes);
  await shipments.addProof(req.params.shipmentId, {
    path: target,
    uploadedBy: req.courierId,
    uploadedAt: new Date().toISOString(),
  });
  return { status: 201, body: { stored: file.filename } };
}

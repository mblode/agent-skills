import { uploadProof } from "../routes/proof-upload.ts";
import { uploadSignature } from "../routes/signature-upload.ts";
import { forAssignedCourier } from "./guards.ts";
import type { CourierHandler, Route } from "./types.ts";

interface CourierRoute {
  method: string;
  path: string;
  handler: CourierHandler;
  upload?: boolean;
}

const courierRoutes: CourierRoute[] = [
  { method: "POST", path: "/shipments/:shipmentId/signature", handler: uploadSignature, upload: true },
  { method: "POST", path: "/shipments/:shipmentId/proof", handler: uploadProof, upload: true },
];

export const routes: Route[] = courierRoutes.map((route) => ({
  ...route,
  handler: forAssignedCourier(route.handler),
}));

export function matchRoute(method: string, url: string): { route: Route; params: Record<string, string> } | null {
  const segments = url.split("?")[0].split("/").filter(Boolean);
  for (const route of routes) {
    if (route.method !== method) continue;
    const pattern = route.path.split("/").filter(Boolean);
    if (pattern.length !== segments.length) continue;
    const params: Record<string, string> = {};
    const matched = pattern.every((part, index) => {
      if (part.startsWith(":")) {
        params[part.slice(1)] = decodeURIComponent(segments[index]);
        return true;
      }
      return part === segments[index];
    });
    if (matched) return { route, params };
  }
  return null;
}

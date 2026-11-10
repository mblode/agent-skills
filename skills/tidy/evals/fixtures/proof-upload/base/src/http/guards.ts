import { authenticateCourier } from "../couriers/auth.ts";
import { shipments } from "../shipments/store.ts";
import type { CourierHandler, Handler } from "./types.ts";

const SHIPMENT_ID = /^shp_[a-z0-9]{12}$/;

export function forAssignedCourier(handler: CourierHandler): Handler {
  return async (req) => {
    const courier = await authenticateCourier(req.headers.authorization);
    if (!courier) {
      return { status: 401, body: { error: "courier token required" } };
    }
    const shipmentId = req.params.shipmentId ?? "";
    if (!SHIPMENT_ID.test(shipmentId)) {
      return { status: 400, body: { error: "malformed shipment id" } };
    }
    const shipment = await shipments.find(shipmentId);
    if (!shipment || shipment.courierId !== courier.id) {
      return { status: 404, body: { error: "shipment not found" } };
    }
    return handler({ ...req, courierId: courier.id });
  };
}

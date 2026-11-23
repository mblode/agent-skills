import { store } from "../lib/store.mjs";

const SERVICES = new Set(["standard", "express", "overnight"]);

function summary({ events, ...shipment }) {
  return shipment;
}

export const shipmentRoutes = [
  {
    method: "GET",
    pattern: /^\/shipments$/,
    handle: ({ query }) => ({ body: { data: store.list(query.get("status")).map(summary) } }),
  },
  {
    method: "POST",
    pattern: /^\/shipments$/,
    handle: ({ body }) => {
      if (!body.recipient?.postcode) return { status: 422, error: "recipient.postcode is required" };
      if (!Number.isInteger(body.weightGrams) || body.weightGrams <= 0) {
        return { status: 422, error: "weightGrams must be a positive integer" };
      }
      if (!SERVICES.has(body.service)) return { status: 422, error: "service must be standard, express or overnight" };
      const shipment = store.create({
        recipient: body.recipient,
        weightGrams: body.weightGrams,
        service: body.service,
      });
      return { status: 201, body: summary(shipment) };
    },
  },
  {
    method: "GET",
    pattern: /^\/shipments\/(?<id>shp_\d+)$/,
    handle: ({ params }) => {
      const shipment = store.get(params.id);
      return shipment ? { body: summary(shipment) } : { status: 404, error: "Shipment not found" };
    },
  },
  {
    method: "GET",
    pattern: /^\/shipments\/(?<id>shp_\d+)\/events$/,
    handle: ({ params }) => {
      const shipment = store.get(params.id);
      return shipment ? { body: { data: shipment.events } } : { status: 404, error: "Shipment not found" };
    },
  },
];

const shipments = new Map();
let sequence = 1000;

export const store = {
  create(input) {
    sequence += 1;
    const shipment = {
      id: `shp_${sequence}`,
      status: "created",
      createdAt: new Date().toISOString(),
      events: [{ at: new Date().toISOString(), status: "created" }],
      ...input,
    };
    shipments.set(shipment.id, shipment);
    return shipment;
  },
  get(id) {
    return shipments.get(id);
  },
  list(status) {
    const all = [...shipments.values()];
    return status ? all.filter((shipment) => shipment.status === status) : all;
  },
};

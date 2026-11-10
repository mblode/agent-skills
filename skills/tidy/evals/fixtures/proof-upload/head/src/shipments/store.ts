export type ShipmentStatus = "created" | "collected" | "in_transit" | "delivered" | "failed";

export interface ProofPhoto {
  path: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Shipment {
  id: string;
  courierId: string;
  status: ShipmentStatus;
  signaturePath?: string;
  proofs?: ProofPhoto[];
}

const records = new Map<string, Shipment>();

export const shipments = {
  async find(id: string): Promise<Shipment | undefined> {
    return records.get(id);
  },
  async save(shipment: Shipment): Promise<void> {
    records.set(shipment.id, shipment);
  },
  async setStatus(id: string, status: ShipmentStatus): Promise<void> {
    const shipment = records.get(id);
    if (shipment) records.set(id, { ...shipment, status });
  },
  async setSignature(id: string, signaturePath: string): Promise<void> {
    const shipment = records.get(id);
    if (shipment) records.set(id, { ...shipment, signaturePath });
  },
  async addProof(id: string, proof: ProofPhoto): Promise<void> {
    const shipment = records.get(id);
    if (shipment) records.set(id, { ...shipment, proofs: [...(shipment.proofs ?? []), proof] });
  },
};

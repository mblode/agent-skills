export interface PaymentEvent {
  id: string;
  invoiceId: string;
  amountMinor: number;
}

export interface EventStore {
  has(eventId: string): boolean;
  add(eventId: string): void;
}

export class MemoryEventStore implements EventStore {
  private readonly seen = new Set<string>();

  has(eventId: string): boolean {
    return this.seen.has(eventId);
  }

  add(eventId: string): void {
    this.seen.add(eventId);
  }
}

export type HandleResult = "applied" | "duplicate";

export class PaymentWebhooks {
  private readonly paid = new Map<string, number>();
  private readonly store: EventStore;

  constructor(store: EventStore = new MemoryEventStore()) {
    this.store = store;
  }

  handle(event: PaymentEvent): HandleResult {
    if (!(event.amountMinor > 0)) {
      throw new RangeError(`event ${event.id} has a non-positive amount`);
    }
    if (this.store.has(event.id)) {
      return "duplicate";
    }
    this.store.add(event.id);
    this.paid.set(event.invoiceId, this.paidFor(event.invoiceId) + event.amountMinor);
    return "applied";
  }

  paidFor(invoiceId: string): number {
    return this.paid.get(invoiceId) ?? 0;
  }
}

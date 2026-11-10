import { listTickets } from "../tickets/store.ts";
import type { TicketStatus } from "../tickets/types.ts";
import { deliveryRegistry } from "./delivery.ts";
import { formatterFor } from "./formatters.ts";
import type { ExportFormat } from "./formatters.ts";

export interface ExportSchedule {
  id: string;
  format: ExportFormat;
  status?: TicketStatus;
  recipients: string[];
}

export async function runScheduledExport(schedule: ExportSchedule, now: Date): Promise<void> {
  const formatter = formatterFor(schedule.format);
  const day = now.toISOString().slice(0, 10);
  const delivery = deliveryRegistry.resolve("email");
  await delivery.deliver({
    filename: `tickets-${day}.${formatter.extension}`,
    contentType: formatter.contentType,
    content: formatter.format(listTickets(schedule.status)),
    recipients: schedule.recipients,
  });
}

import type { Ticket } from "../tickets/types.ts";

export type ExportFormat = "csv" | "json";

export interface TicketFormatter {
  contentType: string;
  extension: string;
  format(tickets: Ticket[]): string;
}

const CSV_HEADER = "id,subject,status,requester,updated_at";

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

const csvFormatter: TicketFormatter = {
  contentType: "text/csv",
  extension: "csv",
  format(tickets) {
    const rows = tickets.map((ticket) =>
      [ticket.id, ticket.subject, ticket.status, ticket.requester, ticket.updatedAt].map(csvCell).join(","),
    );
    return [CSV_HEADER, ...rows].join("\n");
  },
};

const jsonFormatter: TicketFormatter = {
  contentType: "application/json",
  extension: "json",
  format(tickets) {
    return JSON.stringify({ count: tickets.length, tickets }, null, 2);
  },
};

const formatters: Record<ExportFormat, TicketFormatter> = {
  csv: csvFormatter,
  json: jsonFormatter,
};

export function isExportFormat(value: string): value is ExportFormat {
  return Object.hasOwn(formatters, value);
}

export function formatterFor(format: ExportFormat): TicketFormatter {
  return formatters[format];
}

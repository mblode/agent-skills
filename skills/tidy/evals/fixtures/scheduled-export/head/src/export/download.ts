import { listTickets } from "../tickets/store.ts";
import type { TicketStatus } from "../tickets/types.ts";
import { formatterFor, isExportFormat } from "./formatters.ts";

export interface DownloadQuery {
  status?: string;
  format?: string;
}

export interface DownloadResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

const STATUSES: TicketStatus[] = ["open", "pending", "closed"];

export function downloadTickets(query: DownloadQuery): DownloadResponse {
  const status = STATUSES.find((candidate) => candidate === query.status);
  if (query.status !== undefined && !status) {
    return { status: 400, headers: { "content-type": "text/plain" }, body: `unknown status ${query.status}` };
  }
  const format = query.format ?? "csv";
  if (!isExportFormat(format)) {
    return { status: 400, headers: { "content-type": "text/plain" }, body: `unknown format ${format}` };
  }
  const formatter = formatterFor(format);
  return {
    status: 200,
    headers: {
      "content-type": formatter.contentType,
      "content-disposition": `attachment; filename="tickets.${formatter.extension}"`,
    },
    body: formatter.format(listTickets(status)),
  };
}

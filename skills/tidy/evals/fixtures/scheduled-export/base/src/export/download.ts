import { listTickets } from "../tickets/store.ts";
import type { Ticket, TicketStatus } from "../tickets/types.ts";

export interface DownloadQuery {
  status?: string;
}

export interface DownloadResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

const STATUSES: TicketStatus[] = ["open", "pending", "closed"];
const HEADER = "id,subject,status,requester,updated_at";

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function toRow(ticket: Ticket): string {
  return [ticket.id, ticket.subject, ticket.status, ticket.requester, ticket.updatedAt].map(csvCell).join(",");
}

export function downloadTickets(query: DownloadQuery): DownloadResponse {
  const status = STATUSES.find((candidate) => candidate === query.status);
  if (query.status !== undefined && !status) {
    return { status: 400, headers: { "content-type": "text/plain" }, body: `unknown status ${query.status}` };
  }
  const body = [HEADER, ...listTickets(status).map(toRow)].join("\n");
  return {
    status: 200,
    headers: {
      "content-type": "text/csv",
      "content-disposition": 'attachment; filename="tickets.csv"',
    },
    body,
  };
}

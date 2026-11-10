import type { Ticket, TicketStatus } from "./types.ts";

const tickets: Ticket[] = [];

export function addTicket(ticket: Ticket): void {
  tickets.push(ticket);
}

export function listTickets(status?: TicketStatus): Ticket[] {
  const matching = status ? tickets.filter((ticket) => ticket.status === status) : [...tickets];
  return matching.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
}

export function clearTickets(): void {
  tickets.length = 0;
}

export type TicketStatus = "open" | "pending" | "closed";

export interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  requester: string;
  updatedAt: string;
}

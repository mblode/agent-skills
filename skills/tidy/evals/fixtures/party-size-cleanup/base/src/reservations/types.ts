export interface Slot {
  id: string;
  startsAt: string;
  capacity: number;
  seatsTaken: number;
}

export interface ReservationInput {
  slotId: string;
  guestName: string;
  partySize: number;
}

export interface Reservation {
  id: string;
  slotId: string;
  guestName: string;
  partySize: number;
}

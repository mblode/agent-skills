import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { addSlot, clearSlots, seatsLeft } from "../reservations/store.ts";
import { postReservation } from "./reservations-route.ts";

beforeEach(() => {
  clearSlots();
  addSlot({ id: "fri-1900", startsAt: "2026-03-06T19:00:00Z", capacity: 6, seatsTaken: 0 });
});

test("books a party and takes its seats", () => {
  const response = postReservation({ slotId: "fri-1900", guestName: "Okafor", partySize: 4 });
  assert.equal(response.status, 201);
  assert.equal(seatsLeft("fri-1900"), 2);
});

test("rejects a party the slot cannot seat", () => {
  postReservation({ slotId: "fri-1900", guestName: "Okafor", partySize: 4 });
  const response = postReservation({ slotId: "fri-1900", guestName: "Lindqvist", partySize: 3 });
  assert.equal(response.status, 422);
  assert.equal(seatsLeft("fri-1900"), 2);
});

test("rejects a party size that is not a positive whole number", () => {
  assert.equal(postReservation({ slotId: "fri-1900", guestName: "Okafor", partySize: 0 }).status, 422);
  assert.equal(postReservation({ slotId: "fri-1900", guestName: "Okafor", partySize: 2.5 }).status, 422);
});

test("answers 404 for a slot that does not exist", () => {
  const response = postReservation({ slotId: "sat-2100", guestName: "Okafor", partySize: 2 });
  assert.equal(response.status, 404);
});

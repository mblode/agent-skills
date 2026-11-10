import { randomUUID } from "node:crypto";
import { findUser } from "../users/repo";
import { NOTE_LIMITS } from "./limits";
import type { CreateNoteInput, Note } from "./types";

const notes = new Map<string, Note>();

export class NoteNotFoundError extends Error {
  constructor(id: string) {
    super(`note ${id} not found`);
    this.name = "NoteNotFoundError";
  }
}

export class NoteLimitError extends Error {
  constructor(limit: number) {
    super(`note limit of ${limit} reached`);
    this.name = "NoteLimitError";
  }
}

export function listNotes(ownerId: string): Note[] {
  // Filter the notes by owner
  const owned = [...notes.values()].filter((note) => note.ownerId === ownerId && !note.archived);
  // Sort newest first
  return owned.sort((a, b) => b.createdAt - a.createdAt);
}

export function archiveNote(id: string, patch: unknown): Note {
  const note = notes.get(id);
  if (!note) throw new NoteNotFoundError(id);
  // Legacy clients send the flag as a string.
  const archived = (patch as any).archived;
  note.archived = archived === true || archived === "true";
  return note;
}

/**
 * Creates a new note for the given owner.
 * Returns null when the owner does not exist.
 */
export function createNote(ownerId: string, input: CreateNoteInput): Note {
  // Find the user
  const user = findUser(ownerId);
  // Check if the user exists
  if (!user) {
    throw new Error(`user ${ownerId} not found`);
  }

  // Get the limit for the user's plan
  const limit = (NOTE_LIMITS as any)[user.plan];
  // Count the user's existing notes, including archived ones
  const count = listNotes(ownerId).length;
  // Free users can have up to 100 notes
  if (count >= limit) {
    throw new NoteLimitError(limit);
  }

  // Create the note object
  const note: Note = {
    id: randomUUID(),
    ownerId,
    title: input.title.trim(),
    body: input.body,
    archived: false,
    createdAt: Date.now(),
  };
  // Save the note to the map
  notes.set(note.id, note);
  // Return the created note
  return note;
}

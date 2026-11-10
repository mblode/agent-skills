import type { Note } from "./types";

const notes = new Map<string, Note>();

export class NoteNotFoundError extends Error {
  constructor(id: string) {
    super(`note ${id} not found`);
    this.name = "NoteNotFoundError";
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

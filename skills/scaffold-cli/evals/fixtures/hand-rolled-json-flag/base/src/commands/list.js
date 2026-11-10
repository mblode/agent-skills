import { formatNotes } from "../format.js";
import { readNotes } from "../store.js";

export function selectNotes(notes, tag) {
  return tag ? notes.filter((note) => note.tag === tag) : notes;
}

export function list(options) {
  const notes = selectNotes(readNotes(options.file), options.tag);
  console.log(formatNotes(notes));
}

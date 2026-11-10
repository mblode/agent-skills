export function formatNote(note) {
  return `#${String(note.id).padEnd(3)} ${note.addedAt}  [${note.tag}] ${note.text}`;
}

export function formatNotes(notes) {
  if (notes.length === 0) {
    return "no notes yet";
  }
  return notes.map(formatNote).join("\n");
}

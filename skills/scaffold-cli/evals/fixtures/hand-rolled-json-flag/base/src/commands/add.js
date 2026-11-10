import { readNotes, writeNotes } from "../store.js";

export function add(args, options) {
  const [tag, ...words] = args;
  const text = words.join(" ").trim();
  if (!tag || text === "") {
    throw new Error('add needs a tag and some text, for example: dunlin add fix "Handle empty carts"');
  }
  const notes = readNotes(options.file);
  const id = notes.reduce((highest, note) => Math.max(highest, note.id), 0) + 1;
  const note = { id, tag, text, addedAt: new Date().toISOString().slice(0, 10) };
  writeNotes(options.file, [...notes, note]);
  console.log(`added #${id}`);
}

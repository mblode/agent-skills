async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

export function notesRoutes(db) {
  const list = db.prepare("SELECT id, berth, body, author, created_at FROM notes WHERE berth = ? AND deleted_at IS NULL ORDER BY created_at DESC");
  const insert = db.prepare("INSERT INTO notes (berth, body, author, created_at) VALUES (?, ?, ?, ?)");
  const remove = db.prepare("UPDATE notes SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL");

  return [
    {
      method: "GET",
      pattern: /^\/berths\/([a-z0-9-]+)\/notes$/,
      handle: (_request, _url, match) => ({ body: list.all(match[1]) }),
    },
    {
      method: "POST",
      pattern: /^\/berths\/([a-z0-9-]+)\/notes$/,
      handle: async (request, _url, match) => {
        const { body, author } = await readJson(request);
        if (!body || !author) return { status: 422, body: { error: "body_and_author_required" } };
        const { lastInsertRowid } = insert.run(match[1], body, author, new Date().toISOString());
        return { status: 201, body: { id: Number(lastInsertRowid) } };
      },
    },
    {
      method: "DELETE",
      pattern: /^\/notes\/(\d+)$/,
      handle: (_request, _url, match) => {
        const { changes } = remove.run(new Date().toISOString(), Number(match[1]));
        return changes === 0 ? { status: 404, body: { error: "not_found" } } : { status: 204, body: null };
      },
    },
  ];
}

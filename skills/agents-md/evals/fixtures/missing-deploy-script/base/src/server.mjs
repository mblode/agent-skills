import { createServer } from "node:http";
import Database from "better-sqlite3";
import { notesRoutes } from "./routes/notes.mjs";

const db = new Database(process.env.NOTES_DB ?? "notes.db");
const routes = [...notesRoutes(db)];

const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  const route = routes.find((candidate) => candidate.method === request.method && candidate.pattern.test(url.pathname));
  if (!route) {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "not_found" }));
    return;
  }
  try {
    const result = await route.handle(request, url, route.pattern.exec(url.pathname));
    response.writeHead(result.status ?? 200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(result.body));
  } catch (error) {
    console.error(error);
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "internal" }));
  }
});

server.listen(Number(process.env.PORT ?? 4310));

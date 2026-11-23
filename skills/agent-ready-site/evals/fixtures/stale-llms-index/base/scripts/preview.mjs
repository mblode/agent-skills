import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve(import.meta.dirname, "..", "dist");
const types = { ".html": "text/html; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml" };

createServer(async (request, response) => {
  const { pathname } = new URL(request.url, "http://localhost");
  const candidates = path.extname(pathname) ? [pathname] : [`${pathname}.html`, path.join(pathname, "index.html")];
  for (const candidate of candidates) {
    const file = path.join(dist, path.normalize(candidate));
    if (!file.startsWith(dist)) break;
    try {
      const body = await readFile(file);
      response.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" });
      response.end(body);
      return;
    } catch {}
  }
  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found\n");
}).listen(4173, () => console.log("preview on http://localhost:4173"));

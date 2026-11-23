import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadPages } from "./content.mjs";
import { renderHtml, renderMarkdown } from "./render.mjs";

const publicDir = path.resolve(import.meta.dirname, "..", "public");
const PUBLIC_TYPES = {
  "/llms.txt": "text/plain; charset=utf-8",
  "/docs.css": "text/css; charset=utf-8",
  "/robots.txt": "text/plain; charset=utf-8",
};

export async function createApp() {
  const pages = await loadPages();

  return async function app(request, response) {
    const { pathname } = new URL(request.url, "http://localhost");

    if (PUBLIC_TYPES[pathname]) {
      const body = await readFile(path.join(publicDir, pathname));
      response.writeHead(200, { "Content-Type": PUBLIC_TYPES[pathname] });
      response.end(body);
      return;
    }

    const match = /^\/docs\/([a-z0-9-]+)(\.md)?$/.exec(pathname);
    const page = match ? pages.get(match[1]) : undefined;
    if (!page) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found\n");
      return;
    }

    const wantsMarkdown = match[2] === ".md" || request.headers.accept === "text/markdown";
    if (wantsMarkdown) {
      response.writeHead(200, { "Content-Type": "text/markdown; charset=utf-8" });
      response.end(renderMarkdown(page));
      return;
    }

    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(renderHtml(page, pages));
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = await createApp();
  const port = Number(process.env.PORT ?? 4600);
  createServer((request, response) => {
    app(request, response).catch((error) => {
      console.error(error);
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Internal error\n");
    });
  }).listen(port, () => console.log(`docs on http://localhost:${port}`));
}

import { readFile } from "node:fs/promises";
import { limiter } from "./lib/limiter.mjs";
import { rateRoutes } from "./routes/rates.mjs";
import { shipmentRoutes } from "./routes/shipments.mjs";

const routes = [...shipmentRoutes, ...rateRoutes];

const STATIC = {
  "/": ["public/index.html", "text/html; charset=utf-8"],
  "/docs": ["public/docs/index.html", "text/html; charset=utf-8"],
  "/openapi.json": ["openapi.json", "application/json"],
};

function html(response, status, title) {
  response.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  response.end(`<!doctype html><title>${status}</title><h1>${status} ${title}</h1>`);
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export async function handle(request, response) {
  const url = new URL(request.url, "http://localhost");

  const asset = STATIC[url.pathname];
  if (asset && request.method === "GET") {
    const body = await readFile(new URL(`../${asset[0]}`, import.meta.url));
    response.writeHead(200, { "Content-Type": asset[1] });
    response.end(body);
    return;
  }

  const key = request.headers["x-api-key"];
  if (!key) {
    html(response, 401, "Unauthorized");
    return;
  }

  const allowance = limiter.take(key);
  if (!allowance.allowed) {
    html(response, 429, "Too Many Requests");
    return;
  }

  for (const route of routes) {
    const match = route.pattern.exec(url.pathname);
    if (!match) continue;
    if (route.method !== request.method) continue;
    let body = {};
    if (request.method === "POST") {
      try {
        body = await readJson(request);
      } catch {
        html(response, 400, "Bad Request");
        return;
      }
    }
    const result = route.handle({ params: match.groups ?? {}, query: url.searchParams, body });
    if (result.error) {
      html(response, result.status, result.error);
      return;
    }
    response.writeHead(result.status ?? 200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(result.body));
    return;
  }

  html(response, 404, "Not Found");
}

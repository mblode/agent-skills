import { createServer } from "node:http";
import { PORT } from "../config.ts";
import { readUpload, UploadRejected } from "./multipart.ts";
import { matchRoute } from "./router.ts";
import type { Request } from "./types.ts";

async function readBody(stream: AsyncIterable<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export function start(): void {
  const server = createServer(async (incoming, outgoing) => {
    const match = matchRoute(incoming.method ?? "GET", incoming.url ?? "/");
    if (!match) {
      outgoing.writeHead(404).end();
      return;
    }
    const headers = incoming.headers as Record<string, string | undefined>;
    const raw = await readBody(incoming);
    const req: Request = {
      method: match.route.method,
      path: incoming.url ?? "/",
      params: match.params,
      headers,
      body: null,
    };
    try {
      if (match.route.upload) {
        req.file = readUpload(headers, raw);
      } else if (raw.byteLength > 0) {
        req.body = JSON.parse(Buffer.from(raw).toString("utf8"));
      }
      const response = await match.route.handler(req);
      outgoing.writeHead(response.status, { "content-type": "application/json" });
      outgoing.end(JSON.stringify(response.body));
    } catch (error) {
      const status = error instanceof UploadRejected ? error.status : 500;
      outgoing.writeHead(status, { "content-type": "application/json" });
      outgoing.end(JSON.stringify({ error: status === 500 ? "internal error" : (error as Error).message }));
    }
  });
  server.listen(PORT);
}

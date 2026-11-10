import { createServer } from "node:http";
import { postDelivery } from "./routes/deliveries.ts";
import { startOrderWorker, type OrderFeed } from "./workers/index.ts";

export function start(feed: OrderFeed, port: number): AbortController {
  const controller = new AbortController();
  void startOrderWorker(feed, controller.signal);

  const server = createServer(async (incoming, outgoing) => {
    if (incoming.method !== "POST" || incoming.url !== "/deliveries") {
      outgoing.writeHead(404).end();
      return;
    }
    const chunks: Uint8Array[] = [];
    for await (const chunk of incoming) chunks.push(chunk);
    try {
      const result = await postDelivery(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      outgoing.writeHead(result.status, { "content-type": "application/json" });
      outgoing.end(JSON.stringify(result.body));
    } catch {
      outgoing.writeHead(400).end();
    }
  });
  server.listen(port);
  controller.signal.addEventListener("abort", () => server.close());
  return controller;
}

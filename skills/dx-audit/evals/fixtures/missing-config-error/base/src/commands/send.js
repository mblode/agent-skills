import { loadConfig } from "../config.js";
import { enqueue } from "../outbox.js";

export async function send(args) {
  const text = args.join(" ").trim();
  if (text === "") {
    console.error('relay: send needs a message, for example: relay send "deploy finished"');
    process.exitCode = 2;
    return;
  }
  const config = loadConfig();
  const endpoint = new URL(config.endpoint);
  const entry = await enqueue({
    endpoint: endpoint.href,
    channel: config.channel ?? "general",
    retries: config.retries ?? 3,
    text,
  });
  console.log(`queued ${entry.id} for ${endpoint.host}`);
}

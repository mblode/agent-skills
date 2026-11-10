import { createServer } from "node:http";
import { handle } from "./app.mjs";

const port = Number(process.env.PORT ?? 8080);

createServer((request, response) => {
  handle(request, response).catch((error) => {
    console.error(error);
    response.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    response.end("<h1>500 Internal Server Error</h1>");
  });
}).listen(port, () => {
  console.log(`marlin-parcels listening on :${port}`);
});

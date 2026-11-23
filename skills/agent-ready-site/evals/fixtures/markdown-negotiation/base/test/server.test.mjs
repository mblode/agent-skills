import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import { createApp } from "../src/server.mjs";

let server;
let origin;

before(async () => {
  const app = await createApp();
  server = createServer((request, response) => app(request, response));
  await new Promise((resolve) => server.listen(0, resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test("serves a docs page as HTML", async () => {
  const response = await fetch(`${origin}/docs/overview`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.match(await response.text(), /<h1>Overview<\/h1>/);
});

test("serves the markdown twin at the .md URL", async () => {
  const response = await fetch(`${origin}/docs/risk-score.md`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/markdown/);
  assert.match(await response.text(), /^# Risk score/);
});

test("serves markdown when the client asks for it", async () => {
  const response = await fetch(`${origin}/docs/exports`, { headers: { Accept: "text/markdown" } });
  assert.match(response.headers.get("content-type"), /^text\/markdown/);
});

test("answers an unknown page with 404", async () => {
  const response = await fetch(`${origin}/docs/missing`);
  assert.equal(response.status, 404);
});

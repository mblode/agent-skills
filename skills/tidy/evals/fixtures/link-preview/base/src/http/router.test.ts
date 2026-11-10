import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { clearLinks } from "../links/store.ts";
import { route } from "./router.ts";

const NOW = Date.parse("2026-01-12T10:00:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;

function create(body: unknown): { status: number; code: string } {
  const response = route({ method: "POST", path: "/links", body }, NOW);
  return { status: response.status, code: JSON.parse(response.body).code };
}

beforeEach(() => {
  clearLinks();
});

test("creates a link and redirects to its target", () => {
  const { status, code } = create({ target: "https://example.com/docs?page=2" });
  assert.equal(status, 201);
  const response = route({ method: "GET", path: `/${code}` }, NOW);
  assert.equal(response.status, 302);
  assert.equal(response.headers.location, "https://example.com/docs?page=2");
});

test("rejects a target that is not http or https", () => {
  assert.equal(create({ target: "javascript:alert(1)" }).status, 422);
  assert.equal(create({ target: "not a url" }).status, 422);
});

test("answers 410 once a link has expired", () => {
  const { code } = create({ target: "https://example.com/sale", ttlDays: 2 });
  assert.equal(route({ method: "GET", path: `/${code}` }, NOW + DAY_MS).status, 302);
  assert.equal(route({ method: "GET", path: `/${code}` }, NOW + 2 * DAY_MS).status, 410);
});

test("answers 404 for a code nobody created", () => {
  assert.equal(route({ method: "GET", path: "/zzzzzz" }, NOW).status, 404);
});

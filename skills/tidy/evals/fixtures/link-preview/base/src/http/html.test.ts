import assert from "node:assert/strict";
import { test } from "node:test";
import { html } from "./html.ts";

test("leaves the literal markup alone", () => {
  assert.equal(html`<p class="note">hello</p>`, '<p class="note">hello</p>');
});

test("escapes interpolated text", () => {
  const name = "<script>alert(1)</script>";
  assert.equal(html`<p>${name}</p>`, "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>");
});

test("escapes quotes so a value cannot leave its attribute", () => {
  const value = `" onmouseover="x`;
  assert.equal(html`<a title="${value}">x</a>`, '<a title="&quot; onmouseover=&quot;x">x</a>');
});

test("renders numbers", () => {
  assert.equal(html`<b>${3}</b>`, "<b>3</b>");
});

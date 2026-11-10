import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { clearProducts, upsertProduct } from "../catalog/store.ts";
import { getProduct } from "./product-route.ts";

beforeEach(() => {
  clearProducts();
  upsertProduct({
    sku: "BLT-M8-40",
    name: "M8 x 40 hex bolt",
    onHand: 120,
    reorderPoint: 200,
    reorderQty: 1000,
    unitCostCents: 9,
  });
});

test("returns the product with its low stock flag", () => {
  const response = getProduct(" blt-m8-40 ");
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    sku: "BLT-M8-40",
    name: "M8 x 40 hex bolt",
    onHand: 120,
    lowStock: true,
  });
});

test("answers 404 for an unknown sku", () => {
  const response = getProduct("NUT-M8");
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: "no product with sku NUT-M8" });
});

test("reports the normalized sku in the 404 message", () => {
  const response = getProduct(" nut-m8 ");
  assert.deepEqual(response.body, { error: "no product with sku NUT-M8" });
});

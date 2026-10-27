import { test } from "node:test";
import assert from "node:assert/strict";
import {
  filterProducts,
  setQuantity,
  restoreCart,
  calculateTotals,
} from "../src/lib/shop.ts";
import type { Product, Filters } from "../src/types.ts";
const chair: Product = {
  id: "chair",
  name: "Oak Lounge Chair",
  category: "Furniture",
  price: 12999,
  stock: 3,
  image: "",
  color: "Oak",
  description: "A reading chair",
  material: "Wood",
  dimensions: "80cm",
  featured: 1,
};
const lamp: Product = {
  ...chair,
  id: "lamp",
  name: "Arc Table Lamp",
  category: "Lighting",
  price: 4999,
  stock: 0,
  featured: 2,
  color: "White",
  material: "Metal",
  description: "A soft light",
};
const products = [chair, lamp];
const defaults: Filters = {
  query: "",
  category: "All objects",
  maxPrice: 200000,
  inStockOnly: false,
  sort: "featured",
  favoritesOnly: false,
};
test("search is trimmed and case-insensitive across name and materials", () =>
  assert.deepEqual(
    filterProducts(products, { ...defaults, query: "  OAK  " }, []),
    [chair],
  ));
test("category, price and availability combine", () =>
  assert.deepEqual(
    filterProducts(
      products,
      { ...defaults, category: "Lighting", inStockOnly: true },
      [],
    ),
    [],
  ));
test("price sorting does not mutate the original catalog", () => {
  assert.equal(
    filterProducts(products, { ...defaults, sort: "price-asc" }, [])[0].id,
    "lamp",
  );
  assert.equal(products[0].id, "chair");
});
test("favorites filter is explicit", () =>
  assert.deepEqual(
    filterProducts(products, { ...defaults, favoritesOnly: true }, ["lamp"]),
    [lamp],
  ));
test("cart enforces stock and removes zero quantities", () => {
  assert.deepEqual(setQuantity([], chair, 9), [{ id: "chair", quantity: 3 }]);
  assert.deepEqual(setQuantity([{ id: "chair", quantity: 2 }], chair, 0), []);
  assert.deepEqual(setQuantity([], lamp, 1), []);
});
test("persistence rejects corrupt, unknown and non-numeric entries and merges duplicates", () => {
  assert.deepEqual(restoreCart("not json", products), []);
  assert.deepEqual(
    restoreCart(
      JSON.stringify([
        { id: "chair", quantity: 2 },
        { id: "chair", quantity: 2 },
        { id: "missing", quantity: 1 },
        { id: "lamp", quantity: 1 },
      ]),
      products,
    ),
    [{ id: "chair", quantity: 3 }],
  );
  assert.deepEqual(restoreCart('{"x":1}', products), []);
  assert.deepEqual(
    restoreCart('[{"id":"chair","quantity":"2"}]', products),
    [],
  );
});
test("totals use integer cents; shipping is free at $150 and zero for empty cart", () => {
  assert.deepEqual(calculateTotals([], products), {
    subtotal: 0,
    shipping: 0,
    total: 0,
    count: 0,
  });
  assert.deepEqual(calculateTotals([{ id: "chair", quantity: 1 }], products), {
    subtotal: 12999,
    shipping: 800,
    total: 13799,
    count: 1,
  });
  assert.equal(
    calculateTotals([{ id: "chair", quantity: 2 }], products).shipping,
    0,
  );
});

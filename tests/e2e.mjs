import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:5173/";
const out = fileURLToPath(new URL("../artifacts/", import.meta.url));
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const passed = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto(baseURL);
  await page
    .getByRole("heading", { name: "Good things. For everyday living." })
    .waitFor();
  await page.screenshot({ path: out + "desktop-home.png", fullPage: true });
  assert.equal(await page.locator(".product-card").count(), 10);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  passed.push(
    "Desktop catalog loads with 10 products and no horizontal overflow",
  );

  await page
    .getByRole("textbox", { name: "Search products" })
    .fill("  AMBIENT TABLE LAMP  ");
  assert.equal(await page.locator(".product-card").count(), 1);
  await page
    .getByRole("textbox", { name: "Search products" })
    .fill("not-a-real-object");
  await page
    .getByRole("heading", { name: "A little too well hidden." })
    .waitFor();
  await page.getByRole("button", { name: "Explore all objects" }).click();
  await page
    .locator(".desktop-filters .category-options button")
    .filter({ hasText: "Lighting" })
    .click();
  assert.equal(await page.locator(".product-card").count(), 1);
  await page.getByRole("button", { name: "Reset all filters" }).click();
  await page
    .getByRole("combobox", { name: "Sort products" })
    .selectOption("price-asc");
  assert.match(
    await page.locator(".product-card").first().innerText(),
    /Baker’s Rolling Set/,
  );
  passed.push("Search, no-results reset, category filter and price sorting");

  await page
    .getByRole("button", { name: "Save Ambient Table Lamp", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Saved objects 1", exact: true })
    .click();
  assert.equal(await page.locator(".product-card").count(), 1);
  await page
    .getByRole("button", { name: "View Ambient Table Lamp", exact: true })
    .click();
  const detail = page.getByRole("dialog", { name: "Ambient Table Lamp" });
  await detail
    .getByRole("button", { name: "Increase quantity", exact: true })
    .click();
  await detail.getByRole("button", { name: "Add to bag", exact: true }).click();
  await detail.getByRole("button", { name: /Added to your bag/ }).click();
  let bag = page.getByRole("dialog", { name: "Shopping bag" });
  assert.match(await bag.locator(".cart-total").innerText(), /144\.00/);
  await bag
    .getByRole("button", { name: "Increase Ambient Table Lamp quantity" })
    .click();
  assert.match(await bag.locator(".cart-total").innerText(), /204\.00/);
  assert.match(await bag.locator(".cart-summary").innerText(), /Complimentary/);
  await bag.getByRole("button", { name: "Review order", exact: true }).click();
  await bag.getByText(/No order has been placed/).waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").count(), 0);
  await page.reload();
  await page
    .getByRole("button", { name: "Open shopping bag, 3 items" })
    .waitFor();
  await page
    .getByRole("button", { name: "Open shopping bag, 3 items" })
    .click();
  bag = page.getByRole("dialog", { name: "Shopping bag" });
  await bag.getByRole("button", { name: "Remove Ambient Table Lamp" }).click();
  await bag
    .getByRole("heading", { name: "A little room for something lovely." })
    .waitFor();
  await page.keyboard.press("Escape");
  passed.push(
    "Favorites, detail quantities, cart totals, free shipping, demo review, Escape, persistence and empty cart",
  );

  await page.getByRole("button", { name: "View Cherry Bedside Table" }).click();
  const stockDetail = page.getByRole("dialog", {
    name: "Cherry Bedside Table",
  });
  await stockDetail
    .getByRole("button", { name: "Increase quantity", exact: true })
    .click({ clickCount: 2 });
  assert.equal(
    await stockDetail
      .getByRole("button", { name: "Increase quantity", exact: true })
      .isDisabled(),
    true,
  );
  await stockDetail
    .getByRole("button", { name: "Add to bag", exact: true })
    .click();
  assert.equal(
    await stockDetail
      .getByRole("button", { name: "All available items in bag" })
      .isDisabled(),
    true,
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Add Woven Hanging Chair to bag" })
      .isDisabled(),
    true,
  );
  passed.push("Stock ceiling and sold-out product cannot be added");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  const filters = page.getByRole("dialog", { name: "Product filters" });
  await filters
    .locator(".category-options button")
    .filter({ hasText: "Furniture" })
    .click();
  await filters
    .getByRole("checkbox", { name: "In-stock objects only" })
    .check();
  await filters.getByRole("button", { name: "Show 3 objects" }).click();
  assert.equal(await page.locator(".product-card").count(), 3);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.screenshot({ path: out + "mobile-filtered.png", fullPage: true });
  await page
    .getByRole("button", { name: "Open shopping bag, 3 items" })
    .click();
  await page
    .getByRole("dialog", { name: "Shopping bag" })
    .screenshot({ path: out + "mobile-bag.png" });
  await page
    .getByRole("button", { name: "Decrease Cherry Bedside Table quantity" })
    .click();
  assert.match(await page.locator(".cart-total").innerText(), /296\.00/);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await page.getByRole("link", { name: "Form and Field home" }).click();
  await page.screenshot({ path: out + "mobile-home.png", fullPage: true });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Overflow at ${width}px`,
    );
  }
  passed.push(
    "Mobile filter drawer, stock filter, cart interaction; no overflow at 320/375/390/768/1024/1440px",
  );

  await page.evaluate(() =>
    localStorage.setItem("form-field.cart.v1", "{broken"),
  );
  await page.reload();
  await page
    .getByRole("button", { name: "Open shopping bag, 0 items" })
    .waitFor();
  passed.push("Corrupt persisted cart recovers safely");

  const images = page.locator(".product-card img");
  for (let i = 0; i < (await images.count()); i++) {
    await images.nth(i).scrollIntoViewIfNeeded();
    await images.nth(i).evaluate((img) => img.decode());
  }
  passed.push("All 10 local product images decode successfully");
  assert.deepEqual(errors, []);
  await fs.writeFile(
    out + "verification.json",
    JSON.stringify(
      { baseURL, passed, errors, timestamp: new Date().toISOString() },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ passed, errors }, null, 2));
  await context.close();
} finally {
  await browser.close();
}

import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:5174/";
const out = fileURLToPath(new URL("../artifacts/recordings/", import.meta.url));
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const hold = (page, ms) => page.waitForTimeout(ms);
async function record(name, viewport, actions, minSeconds) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    recordVideo: { dir: out, size: viewport },
    isMobile: name === "mobile",
    hasTouch: name === "mobile",
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(baseURL);
  await page.evaluate(() => document.fonts.ready);
  const start = Date.now();
  await actions(page);
  const remaining = minSeconds * 1000 - (Date.now() - start);
  if (remaining > 0) await hold(page, remaining);
  const video = page.video();
  await context.close();
  await video.saveAs(out + name + ".webm");
  console.log(`${name} recording saved; ${(Date.now() - start) / 1000}s`);
}
try {
  await record(
    "desktop",
    { width: 1440, height: 900 },
    async (page) => {
      await hold(page, 5000);
      await page.screenshot({ path: out + "desktop-cover.png" });
      await page
        .getByRole("button", { name: "Explore the collection", exact: true })
        .click();
      await hold(page, 4500);
      await page.locator(".product-card").nth(3).scrollIntoViewIfNeeded();
      await hold(page, 3500);
      await page
        .getByRole("textbox", { name: "Search products" })
        .pressSequentially("lamp", { delay: 180 });
      await hold(page, 3500);
      await page
        .locator(".desktop-filters .category-options button")
        .filter({ hasText: "Lighting" })
        .click();
      await hold(page, 3000);
      await page
        .getByRole("button", { name: "View Ambient Table Lamp" })
        .click();
      await hold(page, 5000);
      let detail = page.getByRole("dialog", { name: "Ambient Table Lamp" });
      await detail
        .getByRole("button", { name: "Increase quantity", exact: true })
        .click();
      await hold(page, 2000);
      await detail
        .getByRole("button", { name: "Add to bag", exact: true })
        .click();
      await hold(page, 3000);
      await detail.getByRole("button", { name: /Added to your bag/ }).click();
      await hold(page, 5000);
      let bag = page.getByRole("dialog", { name: "Shopping bag" });
      await bag
        .getByRole("button", { name: "Increase Ambient Table Lamp quantity" })
        .click();
      await hold(page, 3500);
      await bag
        .getByRole("button", { name: "Review order", exact: true })
        .click();
      await hold(page, 6000);
      await bag
        .getByRole("button", { name: "Back to your bag", exact: true })
        .click();
      await hold(page, 2000);
      await bag
        .getByRole("button", { name: "Decrease Ambient Table Lamp quantity" })
        .click();
      await hold(page, 3000);
      await bag
        .getByRole("button", { name: "Continue exploring", exact: true })
        .click();
      await hold(page, 2000);
      await page.getByRole("button", { name: "Reset all filters" }).click();
      await hold(page, 2500);
      await page
        .getByRole("button", { name: "Save Botanical Planter", exact: true })
        .click();
      await hold(page, 1500);
      await page
        .getByRole("button", { name: "Saved objects 1", exact: true })
        .click();
      await hold(page, 4000);
      await page
        .getByRole("button", { name: "Add Botanical Planter to bag" })
        .click();
      await hold(page, 2500);
      await page.reload();
      await hold(page, 4000);
      await page
        .getByRole("button", { name: "Open shopping bag, 3 items" })
        .click();
      await hold(page, 5000);
      await page
        .getByRole("dialog", { name: "Shopping bag" })
        .getByRole("button", { name: "Continue exploring" })
        .click();
      await page.getByRole("link", { name: "Form and Field home" }).click();
      await hold(page, 3000);
    },
    85,
  );
  console.log("Starting mobile recording");
  await record(
    "mobile",
    { width: 390, height: 844 },
    async (page) => {
      await hold(page, 4000);
      await page.screenshot({ path: out + "mobile-cover.png" });
      await page
        .getByRole("button", { name: "Explore the collection", exact: true })
        .click();
      await hold(page, 4000);
      await page.getByRole("button", { name: "Filters", exact: true }).click();
      await hold(page, 3500);
      let filters = page.getByRole("dialog", { name: "Product filters" });
      await filters
        .locator(".category-options button")
        .filter({ hasText: "Decor" })
        .click();
      await hold(page, 1500);
      await filters
        .getByRole("checkbox", { name: "In-stock objects only" })
        .check();
      await hold(page, 1500);
      await filters.getByRole("button", { name: "Show 3 objects" }).click();
      await hold(page, 4000);
      await page
        .getByRole("button", { name: "View Botanical Planter" })
        .click();
      await hold(page, 4000);
      let detail = page.getByRole("dialog", { name: "Botanical Planter" });
      await detail
        .getByRole("button", { name: "Add to bag", exact: true })
        .click();
      await hold(page, 2500);
      await detail.getByRole("button", { name: /Added to your bag/ }).click();
      await hold(page, 4000);
      let bag = page.getByRole("dialog", { name: "Shopping bag" });
      await bag
        .getByRole("button", { name: "Increase Botanical Planter quantity" })
        .click();
      await hold(page, 3000);
      await bag
        .getByRole("button", { name: "Review order", exact: true })
        .click();
      await hold(page, 4000);
      await bag
        .getByRole("button", { name: "Continue exploring", exact: true })
        .click();
      await hold(page, 1500);
      await page
        .getByRole("button", { name: "Clear all", exact: true })
        .click();
      await page
        .getByRole("textbox", { name: "Search products" })
        .pressSequentially("ceramic bowl", { delay: 130 });
      await hold(page, 3000);
      await page.getByRole("button", { name: "Explore all objects" }).click();
      await hold(page, 2000);
      await page
        .getByRole("combobox", { name: "Sort products" })
        .selectOption("price-asc");
      await hold(page, 2500);
      await page
        .getByRole("button", { name: "View Baker’s Rolling Set" })
        .click();
      await hold(page, 3000);
      await page
        .getByRole("button", { name: "Close Baker’s Rolling Set" })
        .click();
      await page.getByRole("link", { name: "Form and Field home" }).click();
      await hold(page, 3000);
    },
    65,
  );
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("Both recordings complete with no page errors.");
} finally {
  await browser.close();
}

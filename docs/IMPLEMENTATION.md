# Form & Field implementation plan

Goal: an original React shopping demo for international customers, with a complete browse → find → inspect → cart journey on desktop and mobile.

Design: warm off-white, forest green, large editorial serif headings, local product photography, clear prices in USD. Product cards, filter panel, accessible native dialogs for details/cart, persistent cart, informative empty states. No account, backend, real payment, or purchased template.

Architecture: Vite + React + TypeScript. `products.ts` owns the static catalog; `shop.ts` owns pure search/cart/pricing functions; components own presentation; App owns orchestration and browser persistence. Integer cents for totals. `base: './'` supports the existing Tencent Cloud subdirectory hosting without gateway changes.

1. Establish business invariants with Node tests: search, intersection of filters, sorting, stock limits, persistence validation, shipping and cent-accurate totals.
2. Build original responsive storefront, product dialog, and cart. Main actions must be functional and keyboard accessible.
3. Check production build, browser behavior at desktop/mobile widths, persistence, no-results, sold-out state, and console errors.
4. Record 2–3 minutes of real desktop/mobile interaction. Package source with lockfile, README, delivery notes; exclude dependencies and credentials.
5. If time allows, deploy built static files into a new isolated Tencent Cloud path and verify public HTTPS and main flow.

Tradeoffs: simulated inventory and shipping policies; USD only; checkout clearly labeled as a demo. Deployment must not alter existing gateway routes or other applications.

import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about-us.html",
  "/assignment-help",
  "/blog",
  "/contact_us.html",
  "/coursework",
  "/dissertation",
  "/essay-help",
  "/faqs.html",
  "/homework",
  "/order",
  "/privacy-policy",
  "/programming-technical",
  "/proofreading-editing",
  "/reviews",
  "/terms-of-use",
];

test.describe("public route smoke coverage", () => {
  for (const route of publicRoutes) {
    test(`${route} loads successfully`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("body")).not.toContainText("Application error");
    });
  }
});

test("homepage has no hydration or uncaught browser errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/", { waitUntil: "networkidle" });

  expect(consoleErrors.filter((message) => /hydration|uncaught|error/i.test(message))).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("homepage header keeps the brand visible", async ({ page }) => {
  await page.goto("/");
  const header = page.locator(".mah-header");
  await expect(header.locator(".mah-logo")).toBeVisible();
  await expect(header.locator(".mah-shared-logo-mark")).toBeVisible();
  await expect(header.locator("strong")).toContainText("Lara Consultancy");
});

test("dashboard is protected", async ({ page }) => {
  const response = await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/dashboard\/login$/);
  await expect(page.getByRole("heading", { name: "Client dashboard" })).toBeVisible();
});

test.describe("API boundary validation", () => {
  test("enquiries rejects invalid payloads", async ({ request }) => {
    const response = await request.post("/api/enquiries", {
      data: { type: "contact", email: "not-an-email" },
    });
    expect(response.status()).toBe(400);
    expect(await response.text()).toContain("valid type and email");
  });

  test("enquiries requires an idempotency key", async ({ request }) => {
    const response = await request.post("/api/enquiries", {
      data: { type: "contact", email: "qa@example.com" },
    });
    expect(response.status()).toBe(400);
    expect(await response.text()).toContain("submission key");
  });

  test("chat rejects empty messages before persistence", async ({ request }) => {
    const response = await request.post("/api/chat", {
      data: { message: "" },
    });
    expect(response.status()).toBe(400);
    expect(await response.text()).toContain("Enter a message");
  });

  test("chat requires an idempotency key for valid messages", async ({ request }) => {
    const response = await request.post("/api/chat", {
      data: { message: "What services do you offer?" },
    });
    expect(response.status()).toBe(400);
    expect(await response.text()).toContain("message key");
  });

  test("settings mutation rejects cross-origin requests", async ({ request }) => {
    const response = await request.put("/api/site-settings", {
      headers: { Origin: "https://evil.example" },
      data: {},
    });
    expect(response.status()).toBe(403);
    expect(await response.text()).toContain("origin");
  });

  test("settings read response is not cacheable", async ({ request }) => {
    const response = await request.get("/api/site-settings");
    expect([200, 503]).toContain(response.status());
    if (response.status() === 200) {
      expect(response.headers()["cache-control"]).toContain("no-store");
    }
  });
});

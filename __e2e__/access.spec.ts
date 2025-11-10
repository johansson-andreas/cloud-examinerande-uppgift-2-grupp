import { test, expect } from "@playwright/test";

test("@smoke root redirects to login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
});

test.describe("unauthenticated access", () => {
  test("@smoke users are redirected from dashboard and new-entry to login", async ({
    browser,
  }) => {
    // Create a fresh context without any storage state (no auth)
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/new-entry");
    await expect(page).toHaveURL(/\/login/);

    await context.close();
  });
});

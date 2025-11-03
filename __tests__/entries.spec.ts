import { test, expect } from "@playwright/test";

test("create entry, see it on dashboard, then edit it", async ({ page }) => {
  // Generate unique title using timestamp to avoid conflicts from multiple test runs
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, "");
  const testTitle = `E2E Test ${timestamp}`;

  // Step 1: Create an entry
  await page.goto("/new-entry");
  await page.fill("#title", testTitle);
  await page.fill("textarea", "# Hello E2E\n\nThis is test content.");
  await page.getByRole("button", { name: /Save Entry/i }).click();

  // Verify entry was created and is visible on dashboard
  await expect(page).toHaveURL(/\/dashboard/);
  const entryCard = page.locator(".card", {
    has: page.locator("h2", { hasText: testTitle }),
  });
  await expect(entryCard).toBeVisible();
  await expect(
    entryCard.locator(".prose h1", { hasText: "Hello E2E" }),
  ).toBeVisible();

  // Wait a bit for data to fully sync before navigating to edit page
  await page.waitForTimeout(1000);

  // Step 2: Edit the entry
  await page.getByRole("link", { name: "Edit Entry" }).first().click();

  // Verify we're on the edit page with prefilled form
  await expect(page).toHaveURL(/\/edit-entry\/.+/);
  await page.waitForTimeout(500);

  // Wait for the title input to appear and be visible
  await page.locator("#title").waitFor({ state: "visible", timeout: 10000 });

  const origTitle = await page.inputValue("#title");

  // Update the title and save
  await page.fill("#title", origTitle + " (edited)");
  await page.getByRole("button", { name: /Update Entry/i }).click();

  // Verify the edit was successful
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(
    page.locator("h2", { hasText: origTitle + " (edited)" }),
  ).toBeVisible();
});

import { test, expect } from "@playwright/test";

const TEST_EMAIL = process.env.TEST_USER_EMAIL ?? "e2e+user@example.com";
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD ?? "Password123!";

test.use({ storageState: undefined });

test("@ci login -> dashboard -> sign out", async ({ page }) => {
  await page.goto("/login");
  await page.fill("#email", TEST_EMAIL);
  await page.fill("#password", TEST_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator("text=Sign Out")).toBeVisible();

  await page.click("text=Sign Out");
  await expect(page).toHaveURL(/\/login/);
});

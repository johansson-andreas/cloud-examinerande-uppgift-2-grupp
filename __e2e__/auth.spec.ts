import { test, expect } from "@playwright/test";

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

test.use({ storageState: undefined });

test("@smoke login -> dashboard -> sign out", async ({ page }) => {
  test.skip(
    !TEST_EMAIL || !TEST_PASSWORD,
    "TEST_USER_EMAIL and TEST_USER_PASSWORD env vars are required",
  );

  const email = TEST_EMAIL!;
  const password = TEST_PASSWORD!;

  await page.goto("/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator("text=Sign Out")).toBeVisible();

  await page.click("text=Sign Out");
  await expect(page).toHaveURL(/\/login/);
});

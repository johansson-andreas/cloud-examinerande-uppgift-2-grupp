import { test, expect } from "@playwright/test";

test.use({ storageState: undefined });

test("@ci unauthenticated users are redirected from dashboard and new-entry", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);

  await page.goto("/new-entry");
  await expect(page).toHaveURL(/\/login/);
});

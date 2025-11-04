import { chromium } from "@playwright/test";

const TEST_EMAIL = process.env.TEST_USER_EMAIL ?? "e2e+user@example.com";
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD ?? "Password123!";

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

  try {
    await page.goto(`${base}/login`);
    console.log("[globalSetup] Navigated to login page");

    await page.fill("#email", TEST_EMAIL);
    await page.fill("#password", TEST_PASSWORD);
    console.log("[globalSetup] Filled email and password");

    // Click sign in and wait for page load
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForLoadState("networkidle");
    console.log(
      "[globalSetup] Successfully logged in, navigated to:",
      page.url(),
    );

    // Save authenticated storage state used by tests
    await page.context().storageState({ path: "storageState.json" });
    console.log("[globalSetup] Saved storageState.json");
  } catch (error) {
    console.error("[globalSetup] Error during login:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

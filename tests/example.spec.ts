import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await expect(page).toHaveTitle("Document");
});

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByTestId("email").click();
  await page.getByTestId("email").fill("person7@gmail.com");
  await page.getByTestId("password").click();
  await page.getByTestId("password").fill("password");
  page.once("dialog", (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByTestId("login-submit-button").click();
  await expect(page.getByTestId("signed-in-user")).toBeVisible();
});

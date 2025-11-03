import { test, expect } from "@playwright/test";

test("check for sign-in form if not logged in", async ({ page }) => {
  await page.goto("/");

  // Expect to be redirected to sign-in screen
  await page.waitForURL("/signIn");

  // Check if we can see the sign in message
  await expect(
    page.getByRole("heading", { name: "Log in to your account" }),
  ).toBeVisible();
});

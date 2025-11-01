import { test, expect } from '@playwright/test';

test('check for sign-in form if not logged in', async ({ page }) => {
  await page.goto('/');

  // Expect to be redirected to sign-in screen
  await page.waitForURL("/signIn");
  
  // Check if we can see the sign in message
  // Increase timeout as it could fail on cloud with one runner
  await expect(page.getByRole('heading', { name: 'Log in to your account' })).toBeVisible({ timeout: 10000 });
});

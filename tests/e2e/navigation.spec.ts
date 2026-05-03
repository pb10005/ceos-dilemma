import { test, expect } from '@playwright/test';

test('top page and game page are reachable', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /CEO's Dilemma/i })).toBeVisible();

  await page.goto('/game');
  await expect(page.getByText(/CEO's Dilemma/i).first()).toBeVisible();
});

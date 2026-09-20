import { test, expect } from '@playwright/test';

test('homepage exposes child-first discovery', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ChitraMitra/i);
  await expect(page.locator('#language')).toBeVisible();
  await expect(page.locator('#age')).toBeVisible();
  await expect(page.locator('#search')).toBeVisible();
});

test('individual Telugu learning item is printable', async ({ page }) => {
  await page.goto('/learn/te/alphabet/a/');
  await expect(page).toHaveTitle(/ChitraMitra/i);
  await expect(page.locator('.learn-hero')).toBeVisible();
  await expect(page.locator('.learn-print')).toBeVisible();
  await expect(page.locator('button').filter({ hasText: /ప్రింట్|Print/i })).toBeVisible();
});

test('individual number learning item is printable', async ({ page }) => {
  await page.goto('/learn/en/numbers/5/');
  await expect(page.locator('.learn-hero')).toBeVisible();
  await expect(page.locator('.learn-print')).toBeVisible();
});

test('reference resource exposes item-level printing', async ({ page }) => {
  await page.goto('/resources/en/numbers/worksheet.html');
  await expect(page.locator('.item-print-panel')).toBeVisible();
  await expect(page.locator('.item-print').first()).toBeVisible();
  await expect(page.locator('.print-sheet')).toBeVisible();
});

test('mobile layout exposes the same core learning controls', async ({ page }) => {
  await page.goto('/learn/en/numbers/5/');
  await expect(page.locator('.activity-grid')).toBeVisible();
  await expect(page.locator('.learn-nav')).toBeVisible();
});

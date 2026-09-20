import { test, expect } from '@playwright/test';

test('global stylesheets load on homepage', async ({ page }) => { await page.goto('/'); await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(1); const css=await page.locator('link[rel="stylesheet"]').getAttribute('href'); expect(css).toBeTruthy(); const response=await page.request.get(new URL(css, 'http://127.0.0.1:4173/').toString()); expect(response.ok()).toBeTruthy(); expect(response.headers()['content-type'] || '').toMatch(/text\/css/i); const bg=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor); expect(bg).not.toBe('rgba(0, 0, 0, 0)'); });

test('homepage exposes child-first discovery', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ChitraMitra/i);
  await expect(page.locator('#language')).toBeVisible();
  await expect(page.locator('#age')).toBeVisible();
  await expect(page.locator('#search')).toBeVisible();
});

test('individual learning page stylesheets load', async ({ page }) => { await page.goto('/learn/en/numbers/5/'); const hrefs=await page.locator('link[rel="stylesheet"]').evaluateAll(es=>es.map(e=>e.getAttribute('href'))); expect(hrefs).toEqual(expect.arrayContaining(['/styles.css','/learn.css'])); for (const href of hrefs) { const response=await page.request.get(new URL(href, 'http://127.0.0.1:4173/').toString()); expect(response.ok()).toBeTruthy(); expect(response.headers()['content-type'] || '').toMatch(/text\/css/i); } });

test('individual Telugu learning item is printable', async ({ page }) => {
  await page.goto('/learn/te/alphabet/item-01/');
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

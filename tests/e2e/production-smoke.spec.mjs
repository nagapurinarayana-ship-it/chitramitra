import { test, expect } from '@playwright/test';

const numberItem = '/learn/en/numbers/3-wheels/';
const teluguItem = '/learn/te/alphabet/item-01/';

test('global stylesheets load on homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(1);
  const css=await page.locator('link[rel="stylesheet"]').getAttribute('href');
  expect(css).toBeTruthy();
  const response=await page.request.get(new URL(css, 'http://127.0.0.1:4173/').toString());
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type'] || '').toMatch(/text\/css/i);
  const bg=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe('rgba(0, 0, 0, 0)');
});

test('homepage exposes child-first discovery', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ChitraMitra/i);
  await expect(page.locator('#language')).toBeVisible();
  await expect(page.locator('#age')).toBeVisible();
  await expect(page.locator('#search')).toBeVisible();
});

test('individual learning page stylesheets load', async ({ page }) => {
  await page.goto(numberItem);
  const hrefs=await page.locator('link[rel="stylesheet"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
  expect(hrefs).toEqual(expect.arrayContaining(['/styles.css','/learn.css']));
  for (const href of hrefs) {
    const response=await page.request.get(new URL(href, 'http://127.0.0.1:4173/').toString());
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type'] || '').toMatch(/text\/css/i);
  }
});

test('individual Telugu learning item is printable', async ({ page }) => {
  await page.goto(teluguItem);
  await expect(page).toHaveTitle(/ChitraMitra/i);
  await expect(page.locator('.learn-hero')).toBeVisible();
  await expect(page.locator('.learn-print')).toBeVisible();
  await expect(page.locator('button').filter({ hasText: /ప్రింట్|Print/i })).toBeVisible();
});

test('individual number learning item is printable', async ({ page }) => {
  await page.goto(numberItem);
  await expect(page).toHaveTitle(/ChitraMitra/i);
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
  await page.goto(numberItem);
  await expect(page.locator('.activity-grid')).toBeVisible();
  await expect(page.locator('.learn-nav')).toBeVisible();
});

test('homepage remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.home-topic-card')).toHaveCount(20);
  await expect(page.locator('.home-topic-card').first()).toBeVisible();
  await context.close();
});

test('homepage Find button filters topics', async ({ page }) => {
  await page.goto('/');
  await page.locator('#search').fill('animals');
  await page.locator('#searchBtn').click();
  await expect(page.locator('.home-topic-card')).toHaveCount(1);
  await expect(page.locator('.home-topic-card').first()).toContainText('Animals');
});

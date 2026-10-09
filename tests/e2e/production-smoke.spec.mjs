import { test, expect } from '@playwright/test';

const numberItem = '/learn/en/numbers/1-one/';
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

test('homepage exposes direct A4 printable discovery without required filters', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Free A4 Printables/i);
  await expect(page.locator('#language')).toBeVisible();
  await expect(page.locator('#search')).toBeVisible();
  await expect(page.locator('.direct-download').first()).toBeVisible();
  await expect(page.locator('#age')).toHaveCount(0);
  await expect(page.locator('#format')).toHaveCount(0);
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

test('resource print CSS forces A4 and avoids blank trailing pages', async ({ page }) => {
  await page.goto('/resources/en/animals/worksheet.html');
  const css = await page.request.get('http://127.0.0.1:4173/resource.css');
  const text = await css.text();
  expect(text).toMatch(/@page\{size:A4 portrait;margin:0\}/);
  expect(text).not.toContain('page-break-after:always');
  expect(text).toContain('break-after:auto');
});

test('resource preview has one clear print action and a direct PDF download', async ({ page }) => {
  await page.goto('/resources/en/numbers/worksheet.html');
  await expect(page.locator('.actions .download-pdf')).toHaveAttribute('href','/resources/en/numbers/worksheet.pdf');
  await expect(page.locator('.actions button')).toHaveCount(1);
  await expect(page.locator('.print-sheet')).toBeVisible();
  await expect(page.locator('.item-print-panel')).toHaveCount(0);
  await expect(page.locator('.item-print')).toHaveCount(0);
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

test('homepage search filters by topic and keeps direct download available', async ({ page }) => {
  await page.goto('/');
  await page.locator('#search').fill('animals');
  await page.getByRole('button', {name:'Search printables'}).click();
  await expect(page.locator('.home-topic-card')).toHaveCount(1);
  await expect(page.locator('.home-topic-card').first()).toContainText('Animals');
  await expect(page.locator('.direct-download').first()).toHaveAttribute('href','/resources/en/animals/colouring.pdf');
});


test('generated A4 PDF downloads are served as PDF bytes', async ({ request }) => {
  for (const url of ['/resources/en/alphabet/colouring.pdf','/resources/te/alphabet/colouring.pdf','/resources/hi/numbers/worksheet.pdf']) {
    const response=await request.get(url);
    expect(response.ok(),url).toBeTruthy();
    expect((await response.body()).subarray(0,5).toString('ascii'),url).toBe('%PDF-');
  }
});

test('topic collection has direct downloads for all five formats', async ({ page }) => {
  await page.goto('/resources/te/alphabet/');
  await expect(page).toHaveTitle(/അക്ഷരമാല Printables|ChitraMitra|Printables/i);
  await expect(page.locator('.resource-collection-card')).toHaveCount(5);
  await expect(page.locator('.resource-collection-card .download-pdf')).toHaveCount(5);
});

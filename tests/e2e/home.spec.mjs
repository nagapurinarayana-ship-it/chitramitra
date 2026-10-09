import { test, expect } from '@playwright/test';

test('homepage makes direct A4 printables the primary action', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Free A4 Printables/i);
  await expect(page.locator('.home-topic-card')).toHaveCount(20);
  await expect(page.locator('#search')).toBeVisible();
  await expect(page.locator('#language')).toBeVisible();
  await expect(page.locator('#age')).toHaveCount(0);
  await expect(page.locator('#format')).toHaveCount(0);
  const alphabet=page.locator('.home-topic-card[data-topic="alphabet"]');
  await expect(alphabet.locator('.direct-download')).toHaveAttribute('href','/resources/en/alphabet/colouring.pdf');
  await expect(alphabet.locator('.all-formats')).toHaveAttribute('href','/resources/en/alphabet/');
});

test('search finds a topic and offers its A4 PDF directly', async ({ page }) => {
  await page.goto('/');
  await page.locator('#search').fill('animals');
  await expect(page.locator('.home-topic-card')).toHaveCount(1);
  const result=page.locator('.home-topic-card').first();
  await expect(result).toContainText('Animals');
  await expect(result.locator('.direct-download')).toHaveAttribute('href','/resources/en/animals/colouring.pdf');
  await expect(result.locator('.preview-link')).toHaveAttribute('href','/resources/en/animals/colouring.html');
});

test('search understands Indian language names and selects matching script', async ({ page }) => {
  await page.goto('/');
  await page.locator('#search').fill('telugu alphabet');
  await expect(page.locator('#language')).toHaveValue('te');
  await expect(page.locator('.home-topic-card')).toHaveCount(1);
  await expect(page.locator('.home-topic-card').first()).toContainText('అక్షరమాల');
  await expect(page.locator('.home-topic-card .direct-download')).toHaveAttribute('href','/resources/te/alphabet/colouring.pdf');
});

test('search identifies requested format without a separate format wizard', async ({ page }) => {
  await page.goto('/');
  await page.locator('#search').fill('numbers worksheet');
  await expect(page.locator('.home-topic-card')).toHaveCount(1);
  await expect(page.locator('.home-topic-card .direct-download')).toHaveAttribute('href','/resources/en/numbers/worksheet.pdf');
});

test('direct PDF route serves a real PDF file', async ({ page, request }) => {
  await page.goto('/');
  const response=await request.get('/resources/en/alphabet/colouring.pdf');
  expect(response.ok()).toBeTruthy();
  expect((await response.body()).subarray(0,5).toString('ascii')).toBe('%PDF-');
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  const menu=page.locator('#menu');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('.topbar nav')).toHaveClass(/open/);
  await page.locator('.topbar nav a[href="#printables"]').click();
  await expect(menu).toHaveAttribute('aria-expanded','false');
  await expect(page).toHaveURL(/#printables$/);
});

test('resource print action remains functional beside direct download', async ({ page }) => {
  await page.goto('/resources/en/animals/chart.html');
  let prints=0;
  await page.exposeFunction('qaPrint',()=>{prints+=1});
  await page.addInitScript(() => { window.print = () => window.qaPrint(); });
  await page.reload();
  await expect(page.locator('.actions .download-pdf')).toHaveAttribute('href','/resources/en/animals/chart.pdf');
  const printButton=page.locator('.actions button');
  await expect(printButton).toHaveCount(1);
  await printButton.click();
  expect(prints).toBe(1);
  await expect(page.locator('.print-sheet')).toBeVisible();
});

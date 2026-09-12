import { test, expect } from '@playwright/test';

test('homepage controls work', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ChitraMitra/);
  await expect(page.locator('#grid .resource-card')).toHaveCount(20);

  await page.locator('#language').selectOption('te');
  await expect(page.locator('#topicList a').first()).not.toHaveText('Alphabet');

  await page.locator('#age').selectOption('3-4');
  await expect(page.locator('#count')).toContainText('resources');

  await page.locator('button[data-format="worksheet"]').click();
  await expect(page.locator('button[data-format="worksheet"]')).toHaveClass(/active/);

  await page.locator('#search').fill('fruits');
  await page.locator('#searchBtn').click();
  await expect(page.locator('#grid .resource-card')).not.toHaveCount(0);

  await page.locator('#search').fill('');
  await page.locator('#age').selectOption('all');
  await page.locator('button[data-format="all"]').click();
  await page.locator('#topicList a[data-topic="animals"]').click();
  await expect(page.locator('#grid .resource-card')).toHaveCount(5);
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.goto('/');
  const menu=page.locator('#menu');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('.topbar nav')).toHaveClass(/open/);
  await page.getByRole('link', {name:'Resources', exact:true}).first().click();
  await expect(menu).toHaveAttribute('aria-expanded','false');
});

test('resource print controls are functional', async ({ page }) => {
  await page.goto('/resources/en/animals/chart.html');
  let prints=0;
  await page.exposeFunction('qaPrint',()=>{prints+=1});
  await page.addInitScript(() => { window.print = () => window.qaPrint(); });
  await page.reload();
  const buttons=page.locator('.actions button');
  await expect(buttons).toHaveCount(2);
  await buttons.nth(0).click();
  await buttons.nth(1).click();
  expect(prints).toBe(2);
  await expect(page.locator('.print-sheet')).toBeVisible();
});

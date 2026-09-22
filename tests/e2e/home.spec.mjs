import { test, expect } from '@playwright/test';

test('homepage controls work', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ChitraMitra/);
  await expect(page.locator('.home-topic-card')).toHaveCount(20);

  await page.locator('#language').selectOption('te');
  await expect(page.locator('.home-topic-card').first()).toContainText(/అక్షరమాల|సంఖ్యలు|ఆకారాలు|రంగులు/);

  await page.locator('#age').selectOption('3-4');
  await expect(page.locator('#count')).toContainText('learning topics');
  await expect(page.locator('.home-topic-card').count()).resolves.toBeGreaterThan(0);

  await page.locator('#age').selectOption('all');
  await page.locator('#search').fill('fruits');
  await page.locator('#searchBtn').click();
  await expect(page.locator('.home-topic-card')).toHaveCount(1);
  await expect(page.locator('.home-topic-card').first()).toContainText(/పండ్లు|Fruits/);

  await page.locator('#search').fill('');
  await page.locator('#language').selectOption('en');
  await page.locator('#age').selectOption('all');
  await page.locator('.home-topic-card').filter({ hasText: 'Animals' }).click();
  await expect(page).toHaveURL(/\/learn\/en\/animals\/$/);
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  const menu=page.locator('#menu');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('.topbar nav')).toHaveClass(/open/);
  await page.getByRole('link', {name:'Reference', exact:true}).click();
  await expect(page).toHaveURL(/\/resources\/$/);
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

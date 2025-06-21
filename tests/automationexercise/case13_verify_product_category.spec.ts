import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 13: Verify Product Category', () => {
  test('should verify products in different categories', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Test Women category
    await page.locator('a[href="#Women"]').click();
    await page.locator('a[href="/category_products/1"]').click();
    await page.waitForLoadState('networkidle');
    expect(await ae.getProductCount()).toBeGreaterThan(0);
    
    // Test Men category
    await page.locator('a[href="#Men"]').click();
    await page.locator('a[href="/category_products/3"]').click();
    await page.waitForLoadState('networkidle');
    expect(await ae.getProductCount()).toBeGreaterThan(0);
    
    // Test Kids category
    await page.locator('a[href="#Kids"]').click();
    await page.locator('a[href="/category_products/7"]').click();
    await page.waitForLoadState('networkidle');
    expect(await ae.getProductCount()).toBeGreaterThan(0);
  });
}); 
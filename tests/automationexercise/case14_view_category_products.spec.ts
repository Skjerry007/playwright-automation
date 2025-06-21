import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 14: View Category Products', () => {
  test('should view products in Women category', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Navigate to Women category
    await page.locator('a[href="#Women"]').click();
    await page.locator('a[href="/category_products/1"]').click();
    await page.waitForLoadState('networkidle');
    
    // Verify category title
    await expect(page.locator('h2.title.text-center')).toContainText('Women');
    expect(await ae.getProductCount()).toBeGreaterThan(0);
  });

  test('should view products in Men category', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Navigate to Men category
    await page.locator('a[href="#Men"]').click();
    await page.locator('a[href="/category_products/3"]').click();
    await page.waitForLoadState('networkidle');
    
    // Verify category title
    await expect(page.locator('h2.title.text-center')).toContainText('Men');
    expect(await ae.getProductCount()).toBeGreaterThan(0);
  });
}); 
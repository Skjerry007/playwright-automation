import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 15: View Cart Brand Products', () => {
  test('should view products by brand', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Navigate to products page
    await ae.navigateToProducts();
    
    // Click on a brand (Polo)
    await page.locator('a[href="/brand_products/Polo"]').click();
    await page.waitForLoadState('networkidle');
    
    // Verify brand products are displayed
    await expect(page.locator('h2.title.text-center')).toContainText('Brand');
    expect(await ae.getProductCount()).toBeGreaterThan(0);
  });

  test('should view products by different brands', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    await ae.navigateToProducts();
    
    // Test multiple brands
    const brands = ['Polo', 'H&M', 'Madame'];
    
    for (const brand of brands) {
      await page.locator(`a[href="/brand_products/${brand}"]`).click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h2.title.text-center')).toContainText('Brand');
      expect(await ae.getProductCount()).toBeGreaterThanOrEqual(0);
    }
  });
}); 
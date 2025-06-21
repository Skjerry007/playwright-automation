import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 31: Verify Product Details', () => {
  test('should verify product details page information', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    await ae.navigateToProducts();
    
    // Click on first product to view details
    await page.locator('a[href^="/product_details/"]').first().click();
    await page.waitForLoadState('networkidle');
    
    // Verify product information is displayed
    await expect(page.locator('.product-information h2')).toBeVisible();
    await expect(page.locator('.product-information p')).toBeVisible();
    await expect(page.locator('.product-information span')).toBeVisible();
    
    // Verify product image is displayed
    await expect(page.locator('.product-image-preview img')).toBeVisible();
    
    // Verify quantity input is present
    await expect(page.locator('#quantity')).toBeVisible();
    
    // Verify add to cart button is present
    await expect(page.locator('button:has-text("Add to cart")')).toBeVisible();
  });
}); 
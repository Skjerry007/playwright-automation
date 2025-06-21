import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 22: Add to Cart from Product Details', () => {
  test('should add product to cart from product details page', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    await ae.navigateToProducts();
    
    // Click on first product to view details
    await page.locator('a[href^="/product_details/"]').first().click();
    await page.waitForLoadState('networkidle');
    
    // Get product name for verification
    const productName = await page.locator('.product-information h2').textContent();
    
    // Add to cart from product details
    await page.locator('button:has-text("Add to cart")').click();
    await page.waitForTimeout(1000);
    
    // View cart
    await ae.viewCart();
    
    // Verify product is in cart
    if (productName) {
      await ae.verifyProductInCart(productName.trim());
    }
  });
}); 
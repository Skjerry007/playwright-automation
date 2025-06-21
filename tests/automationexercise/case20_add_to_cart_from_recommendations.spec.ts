import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 20: Add to Cart from Recommendations', () => {
  test('should add recommended products to cart', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Scroll to recommendations section
    await page.keyboard.press('End');
    
    // Wait for recommendations to load
    await page.waitForSelector('#recommended-item-carousel', { timeout: 10000 });
    
    // Add recommended product to cart
    const addToCartButton = page.locator('#recommended-item-carousel .add-to-cart').first();
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      await page.waitForTimeout(1000);
      
      // View cart to verify
      await ae.viewCart();
      expect(await ae.getCartProductCount()).toBeGreaterThan(0);
    }
  });
}); 
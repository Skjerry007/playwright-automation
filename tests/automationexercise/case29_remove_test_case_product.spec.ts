import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 29: Remove Test Case Product', () => {
  test('should add products and remove them from cart', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    await ae.navigateToProducts();
    
    // Add multiple products to cart
    await ae.addProductToCart(0);
    await ae.continueShopping();
    await ae.addProductToCart(1);
    await ae.continueShopping();
    await ae.addProductToCart(2);
    await ae.viewCart();
    
    // Verify products are in cart
    const initialCount = await ae.getCartProductCount();
    expect(initialCount).toBeGreaterThan(0);
    
    // Remove all products one by one
    const deleteButtons = page.locator('.cart_quantity_delete');
    const count = await deleteButtons.count();
    
    for (let i = 0; i < count; i++) {
      await deleteButtons.first().click();
      await page.waitForTimeout(500);
    }
    
    // Verify cart is empty
    await ae.verifyCartIsEmpty();
  });
}); 
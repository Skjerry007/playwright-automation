import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 12: Remove Products From Cart', () => {
  test('should add products to cart and then remove them', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    await ae.navigateToProducts();
    
    // Add first product
    await ae.addProductToCart(0);
    await ae.continueShopping();
    
    // Add second product
    await ae.addProductToCart(1);
    await ae.viewCart();
    
    // Verify products are in cart
    expect(await ae.getCartProductCount()).toBeGreaterThan(0);
    
    // Remove all products
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
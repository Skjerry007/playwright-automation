import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 17: Remove Products From Cart (Logged In)', () => {
  test('should login, add products to cart, and remove them', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    const user = props.getTestData('validUser');
    
    await page.goto(props.getBaseUrl());
    
    // Login first
    await ae.navigateToSignupLogin();
    await ae.login(user.email, user.password);
    await ae.verifyLoginSuccess();
    
    // Add products to cart
    await ae.navigateToProducts();
    await ae.addProductToCart(0);
    await ae.continueShopping();
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
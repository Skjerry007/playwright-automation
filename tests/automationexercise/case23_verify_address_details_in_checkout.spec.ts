import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 23: Verify Address Details in Checkout', () => {
  test('should verify address details in checkout page', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    const user = props.getTestData('validUser');
    
    await page.goto(props.getBaseUrl());
    
    // Login first
    await ae.navigateToSignupLogin();
    await ae.login(user.email, user.password);
    await ae.verifyLoginSuccess();
    
    // Add product to cart
    await ae.navigateToProducts();
    await ae.addProductToCart(0);
    await ae.viewCart();
    
    // Proceed to checkout
    await ae.proceedToCheckout.click();
    await page.waitForLoadState('networkidle');
    
    // Verify address details section is present
    await expect(page.locator('h2:has-text("Address Details")')).toBeVisible();
    await expect(page.locator('h2:has-text("Review Your Order")')).toBeVisible();
    
    // Verify delivery address is displayed
    await expect(page.locator('#address_delivery')).toBeVisible();
    
    // Verify billing address is displayed
    await expect(page.locator('#address_invoice')).toBeVisible();
  });
}); 
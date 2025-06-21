import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 16: Login Before Checkout', () => {
  test('should login and proceed to checkout', async ({ page }) => {
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
    
    // Verify checkout page is loaded
    await expect(page.locator('h2:has-text("Address Details")')).toBeVisible();
  });
}); 
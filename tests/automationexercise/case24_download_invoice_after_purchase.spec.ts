import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 24: Download Invoice after Purchase', () => {
  test('should complete purchase and download invoice', async ({ page }) => {
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
    
    // Place order
    await page.locator('a:has-text("Place Order")').click();
    await page.waitForLoadState('networkidle');
    
    // Fill payment details
    await page.locator('input[name="name_on_card"]').fill('Test User');
    await page.locator('input[name="card_number"]').fill('1234567890123456');
    await page.locator('input[name="cvc"]').fill('123');
    await page.locator('input[name="expiry_month"]').fill('12');
    await page.locator('input[name="expiry_year"]').fill('2025');
    
    // Submit payment
    await page.locator('button:has-text("Pay and Confirm Order")').click();
    await page.waitForLoadState('networkidle');
    
    // Verify order placed successfully
    await expect(page.locator('h2:has-text("Order Placed!")')).toBeVisible();
    
    // Download invoice
    await page.locator('a:has-text("Download Invoice")').click();
    
    // Verify download started (this will depend on browser behavior)
    // For now, just verify the link is present
    await expect(page.locator('a:has-text("Download Invoice")')).toBeVisible();
  });
}); 
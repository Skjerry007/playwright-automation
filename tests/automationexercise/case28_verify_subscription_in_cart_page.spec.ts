import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 28: Verify Subscription in Cart Page', () => {
  test('should verify subscription functionality in cart page', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Add product to cart first
    await ae.navigateToProducts();
    await ae.addProductToCart(0);
    await ae.viewCart();
    
    // Scroll to subscription section
    await page.keyboard.press('End');
    await page.waitForTimeout(1000);
    
    // Verify subscription section is visible
    await expect(page.locator('#susbscribe_email')).toBeVisible();
    await expect(page.locator('h2:has-text("SUBSCRIPTION")')).toBeVisible();
    
    // Subscribe with email
    await page.locator('#susbscribe_email').fill('test@example.com');
    await page.locator('#subscribe').click();
    
    // Verify subscription success
    await expect(page.locator('.alert-success')).toContainText('You have been successfully subscribed!');
  });
}); 
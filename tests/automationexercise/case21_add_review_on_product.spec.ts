import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 21: Add Review on Product', () => {
  test('should add a review to a product', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    await ae.navigateToProducts();
    
    // Click on first product to view details
    await page.locator('a[href^="/product_details/"]').first().click();
    await page.waitForLoadState('networkidle');
    
    // Scroll to review section
    await page.keyboard.press('End');
    await page.waitForTimeout(1000);
    
    // Fill review form
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#review').fill('This is a great product! Highly recommended.');
    
    // Submit review
    await page.locator('#button-review').click();
    
    // Verify review submission
    await expect(page.locator('.alert-success')).toContainText('Thank you for your review.');
  });
}); 
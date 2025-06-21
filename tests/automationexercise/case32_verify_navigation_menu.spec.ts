import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 32: Verify Navigation Menu', () => {
  test('should verify all navigation menu items', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Test Home navigation
    await page.locator('a[href="/"]').click();
    await expect(page.locator('h2:has-text("Features Items")')).toBeVisible();
    
    // Test Products navigation
    await ae.navigateToProducts();
    await expect(page.locator('h2.title.text-center')).toContainText('All Products');
    
    // Test Cart navigation
    await page.locator('a[href="/view_cart"]').click();
    await expect(page.locator('h2:has-text("Shopping Cart")')).toBeVisible();
    
    // Test Signup/Login navigation
    await ae.navigateToSignupLogin();
    await expect(page.locator('h2:has-text("Login to your account")')).toBeVisible();
    
    // Test Test Cases navigation
    await page.locator('a[href="/test_cases"]').click();
    await expect(page.locator('h2.title.text-center')).toContainText('Test Cases');
    
    // Test API Testing navigation
    await page.locator('a[href="/api_list"]').click();
    await expect(page.locator('h2.title.text-center')).toContainText('APIs List for practice');
  });
}); 
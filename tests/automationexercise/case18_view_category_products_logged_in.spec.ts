import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 18: View Category Products (Logged In)', () => {
  test('should login and view products in different categories', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    const user = props.getTestData('validUser');
    
    await page.goto(props.getBaseUrl());
    
    // Login first
    await ae.navigateToSignupLogin();
    await ae.login(user.email, user.password);
    await ae.verifyLoginSuccess();
    
    // View Women category
    await page.locator('a[href="#Women"]').click();
    await page.locator('a[href="/category_products/1"]').click();
    await page.waitForLoadState('networkidle');
    expect(await ae.getProductCount()).toBeGreaterThan(0);
    
    // View Men category
    await page.locator('a[href="#Men"]').click();
    await page.locator('a[href="/category_products/3"]').click();
    await page.waitForLoadState('networkidle');
    expect(await ae.getProductCount()).toBeGreaterThan(0);
    
    // Verify user is still logged in
    await ae.verifyLoginSuccess();
  });
}); 
import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 19: Search Products (Logged In)', () => {
  test('should login and search for products', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    const user = props.getTestData('validUser');
    const product = props.getTestData('productData').searchProduct;
    
    await page.goto(props.getBaseUrl());
    
    // Login first
    await ae.navigateToSignupLogin();
    await ae.login(user.email, user.password);
    await ae.verifyLoginSuccess();
    
    // Search for products
    await ae.navigateToProducts();
    await ae.searchProduct(product);
    expect(await ae.getProductCount()).toBeGreaterThan(0);
    
    // Verify user is still logged in
    await ae.verifyLoginSuccess();
  });

  test('should search for non-existent product', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    const user = props.getTestData('validUser');
    
    await page.goto(props.getBaseUrl());
    
    // Login first
    await ae.navigateToSignupLogin();
    await ae.login(user.email, user.password);
    await ae.verifyLoginSuccess();
    
    // Search for non-existent product
    await ae.navigateToProducts();
    await ae.searchProduct('NonExistentProduct123');
    expect(await ae.getProductCount()).toBe(0);
  });
}); 
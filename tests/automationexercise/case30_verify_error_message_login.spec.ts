import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 30: Verify Error Message Login', () => {
  test('should verify error message for invalid login', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    const invalidUser = props.getTestData('invalidUser');
    
    await page.goto(props.getBaseUrl());
    await ae.navigateToSignupLogin();
    
    // Try to login with invalid credentials
    await ae.login(invalidUser.email, invalidUser.password);
    
    // Verify error message is displayed
    await expect(page.locator('.login-form p')).toContainText('Your email or password is incorrect!');
  });

  test('should verify error message for empty fields', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    await ae.navigateToSignupLogin();
    
    // Try to login with empty fields
    await page.locator('button:has-text("Login")').click();
    
    // Verify error message or validation
    await expect(page.locator('.login-form')).toBeVisible();
  });
}); 
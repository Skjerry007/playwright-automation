import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 2: Login User with correct credentials', () => {
  test('should login with valid credentials and logout', async ({ page }) => {
    const props = Properties.getInstance();
    const user = props.getTestData('validUser');
    const ae = new AutomationExercisePage(page);

    await page.goto(props.getBaseUrl());
    await ae.navigateToSignupLogin();
    await ae.login(user.email, user.password);
    await ae.verifyLoginSuccess();
    await ae.logout();
    await expect(ae.loginButton).toBeVisible();
  });
}); 
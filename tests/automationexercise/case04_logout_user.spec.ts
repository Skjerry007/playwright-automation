import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 4: Logout User', () => {
  test('should login and then logout', async ({ page }) => {
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
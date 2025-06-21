import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 3: Login User with incorrect credentials', () => {
  test('should show error for invalid login', async ({ page }) => {
    const props = Properties.getInstance();
    const user = props.getTestData('invalidUser');
    const ae = new AutomationExercisePage(page);

    await page.goto(props.getBaseUrl());
    await ae.navigateToSignupLogin();
    await ae.login(user.email, user.password);
    await ae.verifyLoginError();
  });
}); 
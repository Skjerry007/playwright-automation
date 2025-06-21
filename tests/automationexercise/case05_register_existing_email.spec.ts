import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 5: Register User with existing email', () => {
  test('should show error when registering with existing email', async ({ page }) => {
    const props = Properties.getInstance();
    const user = props.getTestData('validUser');
    const ae = new AutomationExercisePage(page);

    await page.goto(props.getBaseUrl());
    await ae.navigateToSignupLogin();
    await ae.signup(user.name, user.email);
    await ae.verifySignupError();
  });
}); 
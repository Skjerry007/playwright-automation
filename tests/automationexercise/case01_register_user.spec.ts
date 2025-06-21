import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 1: Register User', () => {
  test('should register a new user and delete the account', async ({ page }) => {
    const props = Properties.getInstance();
    const user = props.getTestData('newUser');
    const ae = new AutomationExercisePage(page);

    await page.goto(props.getBaseUrl());
    await ae.navigateToSignupLogin();
    await ae.signup(user.name, user.email);
    // Fill additional registration details if required (not shown here for brevity)
    // ...
    // After registration, verify login
    await ae.verifyLoginSuccess();
    // Delete account
    await ae.deleteAccount();
    await ae.verifyAccountDeleted();
    await ae.continueAfterAccountDeletion();
  });
}); 
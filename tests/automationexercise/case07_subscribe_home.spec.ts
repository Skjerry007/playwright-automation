import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 7: Verify Subscription in Home Page', () => {
  test('should subscribe to newsletter from home page', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    const email = props.getTestData('subscriptionEmail');
    await page.goto(props.getBaseUrl());
    await ae.subscribeToNewsletter(email);
    await ae.verifySubscriptionSuccess();
  });
}); 
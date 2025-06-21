import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 8: Verify Subscription in Cart Page', () => {
  test('should subscribe to newsletter from cart page', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    const email = props.getTestData('subscriptionEmail');
    await page.goto(props.getBaseUrl());
    await ae.navigateToCart();
    await ae.subscribeToNewsletter(email);
    await ae.verifySubscriptionSuccess();
  });
}); 
import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';
import { AutomationExerciseLocators as Locators } from '../../locators/automation-exercise-locators';

test.describe('Case 6: Contact Us Form', () => {
  test('should submit contact us form successfully', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    await page.goto(props.getBaseUrl());
    await ae.navigateToContactUs();
    await page.fill(Locators.CONTACT_NAME, 'Test User');
    await page.fill(Locators.CONTACT_EMAIL, 'testuser@example.com');
    await page.fill(Locators.CONTACT_SUBJECT, 'Test Subject');
    await page.fill(Locators.CONTACT_MESSAGE, 'This is a test message.');
    // File upload is optional, skip for now
    await page.click(Locators.CONTACT_SUBMIT);
    await expect(page.locator(Locators.CONTACT_SUCCESS)).toBeVisible();
  });
}); 
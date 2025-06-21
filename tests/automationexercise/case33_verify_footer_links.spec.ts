import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 33: Verify Footer Links', () => {
  test('should verify footer links functionality', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Scroll to footer
    await page.keyboard.press('End');
    await page.waitForTimeout(1000);
    
    // Test About Us link
    await page.locator('a[href="/about_us"]').click();
    await expect(page.locator('h2.title.text-center')).toContainText('About Us');
    
    // Go back and test Contact Us link
    await page.goto(props.getBaseUrl());
    await page.keyboard.press('End');
    await page.waitForTimeout(1000);
    await page.locator('a[href="/contact_us"]').click();
    await expect(page.locator('h2.title.text-center')).toContainText('Get In Touch');
    
    // Go back and test Privacy Policy link
    await page.goto(props.getBaseUrl());
    await page.keyboard.press('End');
    await page.waitForTimeout(1000);
    await page.locator('a[href="/privacy_policy"]').click();
    await expect(page.locator('h2.title.text-center')).toContainText('Privacy Policy');
  });
}); 
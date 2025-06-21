import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 26: Verify Scroll Up without Arrow', () => {
  test('should scroll down and then scroll up using keyboard', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Scroll down to footer
    await page.keyboard.press('End');
    await page.waitForTimeout(1000);
    
    // Verify we're at the bottom (subscription section should be visible)
    await expect(page.locator('#susbscribe_email')).toBeVisible();
    
    // Scroll up using keyboard
    await page.keyboard.press('Home');
    await page.waitForTimeout(1000);
    
    // Verify we're back at the top (header should be visible)
    await expect(page.locator('header')).toBeVisible();
    
    // Verify subscription section is not visible (scrolled up)
    await expect(page.locator('#susbscribe_email')).not.toBeVisible();
  });
}); 
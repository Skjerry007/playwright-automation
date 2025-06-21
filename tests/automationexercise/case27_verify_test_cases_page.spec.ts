import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 27: Verify Test Cases Page', () => {
  test('should navigate to test cases page and verify content', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Navigate to test cases page
    await page.locator('a[href="/test_cases"]').click();
    await page.waitForLoadState('networkidle');
    
    // Verify test cases page is loaded
    await expect(page.locator('h2.title.text-center')).toContainText('Test Cases');
    
    // Verify test cases content is present
    await expect(page.locator('.panel-group')).toBeVisible();
    
    // Verify specific test case sections are present
    await expect(page.locator('a[href="#collapse1"]')).toBeVisible();
    await expect(page.locator('a[href="#collapse2"]')).toBeVisible();
  });
}); 
import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 34: Verify API Testing', () => {
  test('should verify API testing page and endpoints', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Navigate to API Testing page
    await page.locator('a[href="/api_list"]').click();
    await page.waitForLoadState('networkidle');
    
    // Verify API testing page is loaded
    await expect(page.locator('h2.title.text-center')).toContainText('APIs List for practice');
    
    // Verify API endpoints are listed
    await expect(page.locator('a[href="/api_list"]')).toBeVisible();
    
    // Test GET All Products List API link
    await page.locator('a[href="/api_listproduct"]').click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2.title.text-center')).toContainText('All Products List');
    
    // Go back and test POST To All Products List API link
    await page.goto(props.getBaseUrl() + '/api_list');
    await page.locator('a[href="/api_listproduct"]').click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h2.title.text-center')).toContainText('All Products List');
  });
}); 
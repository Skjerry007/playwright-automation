import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 9: Search Product', () => {
  test('should search for a product and display results', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    const product = props.getTestData('productData').searchProduct;
    await page.goto(props.getBaseUrl());
    await ae.navigateToProducts();
    await ae.searchProduct(product);
    expect(await ae.getProductCount()).toBeGreaterThan(0);
  });
}); 
import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 10: Add Products in Cart', () => {
  test('should add a product to cart and verify', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    const product = props.getTestData('productData').searchProduct;
    await page.goto(props.getBaseUrl());
    await ae.navigateToProducts();
    await ae.searchProduct(product);
    await ae.addProductToCart(0);
    await ae.viewCart();
    await ae.verifyProductInCart(product);
  });
}); 
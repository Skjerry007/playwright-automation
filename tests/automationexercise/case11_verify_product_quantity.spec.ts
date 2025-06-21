import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Case 11: Verify Product Quantity in Cart', () => {
  test('should verify and update product quantity in cart', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    await ae.navigateToProducts();
    await ae.addProductToCart(0);
    await ae.viewCart();
    
    // Verify initial quantity
    const initialQuantity = await page.locator('.cart_quantity').first().textContent();
    expect(initialQuantity).toBe('1');
    
    // Update quantity
    await page.locator('.cart_quantity_up').first().click();
    await page.waitForTimeout(1000);
    
    // Verify updated quantity
    const updatedQuantity = await page.locator('.cart_quantity').first().textContent();
    expect(updatedQuantity).toBe('2');
  });

  test('should decrease product quantity in cart', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    await ae.navigateToProducts();
    await ae.addProductToCart(0);
    await ae.viewCart();
    
    // Increase quantity first
    await page.locator('.cart_quantity_up').first().click();
    await page.waitForTimeout(1000);
    
    // Verify quantity is 2
    let quantity = await page.locator('.cart_quantity').first().textContent();
    expect(quantity).toBe('2');
    
    // Decrease quantity
    await page.locator('.cart_quantity_down').first().click();
    await page.waitForTimeout(1000);
    
    // Verify quantity is back to 1
    quantity = await page.locator('.cart_quantity').first().textContent();
    expect(quantity).toBe('1');
  });
}); 
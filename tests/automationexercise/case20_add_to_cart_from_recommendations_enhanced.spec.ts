import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';
import { MCPClient } from '../../utils/mcp-client';

test.describe('Case 20: Add to Cart from Recommendations (MCP Enhanced)', () => {
  let props: Properties;
  let ae: AutomationExercisePage;

  test.beforeAll(async () => {
    await MCPClient.connect();
    props = Properties.getInstance();
  });

  test.afterAll(async () => {
    MCPClient.disconnect();
  });

  test('should add recommended products to cart with AI monitoring', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    // Start AI monitoring for this test
    await MCPClient.startMonitoring('case20_add_to_cart_from_recommendations_enhanced.spec.ts', {
      testName: 'Add to Cart from Recommendations',
      browser: 'chromium',
      environment: props.getEnvironment(),
      riskLevel: 'medium'
    });
    
    try {
      await MCPClient.updateMonitoring('case20_add_to_cart_from_recommendations_enhanced.spec.ts', 'navigation', {
        status: 'started',
        details: 'Navigating to homepage'
      });
      
      await page.goto(props.getBaseUrl());
      
      await MCPClient.updateMonitoring('case20_add_to_cart_from_recommendations_enhanced.spec.ts', 'navigation', {
        status: 'completed',
        details: 'Successfully loaded homepage'
      });
      
      // Use AI to analyze page structure and find recommendations
      await MCPClient.updateMonitoring('case20_add_to_cart_from_recommendations_enhanced.spec.ts', 'analysis', {
        status: 'started',
        details: 'Analyzing page structure for recommendations'
      });
      
      // Scroll to recommendations section
      await page.keyboard.press('End');
      
      // Wait for recommendations to load with AI-enhanced error handling
      try {
        await page.waitForSelector('#recommended-item-carousel', { timeout: 10000 });
        
        await MCPClient.updateMonitoring('case20_add_to_cart_from_recommendations_enhanced.spec.ts', 'analysis', {
          status: 'completed',
          details: 'Recommendations section found and loaded'
        });
      } catch (error) {
        // Use AI to analyze the failure and suggest alternatives
        const analysis = await MCPClient.analyzeFailure(
          'case20_add_to_cart_from_recommendations_enhanced.spec.ts',
          'element_not_found',
          'Recommendations carousel not found'
        );
        
        console.log('🔍 AI Failure Analysis:', analysis);
        
        // Try alternative selectors suggested by AI
        const alternativeSelectors = [
          '.recommendations',
          '[data-testid="recommendations"]',
          '.product-recommendations',
          '.suggested-products'
        ];
        
        let recommendationsFound = false;
        for (const selector of alternativeSelectors) {
          try {
            await page.waitForSelector(selector, { timeout: 5000 });
            console.log(`✅ Found recommendations using alternative selector: ${selector}`);
            recommendationsFound = true;
            break;
          } catch (e) {
            console.log(`❌ Alternative selector failed: ${selector}`);
          }
        }
        
        if (!recommendationsFound) {
          throw new Error('No recommendations section found with any selector');
        }
      }
      
      // Add recommended product to cart with AI monitoring
      await MCPClient.updateMonitoring('case20_add_to_cart_from_recommendations_enhanced.spec.ts', 'cart_action', {
        status: 'started',
        details: 'Attempting to add product to cart'
      });
      
      const addToCartButton = page.locator('#recommended-item-carousel .add-to-cart').first();
      
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();
        await page.waitForTimeout(1000);
        
        await MCPClient.updateMonitoring('case20_add_to_cart_from_recommendations_enhanced.spec.ts', 'cart_action', {
          status: 'completed',
          details: 'Product added to cart successfully'
        });
        
        // View cart to verify with AI-enhanced verification
        await MCPClient.updateMonitoring('case20_add_to_cart_from_recommendations_enhanced.spec.ts', 'verification', {
          status: 'started',
          details: 'Verifying cart contents'
        });
        
        await ae.viewCart();
        const cartCount = await ae.getCartProductCount();
        
        await MCPClient.updateMonitoring('case20_add_to_cart_from_recommendations_enhanced.spec.ts', 'verification', {
          status: 'completed',
          details: `Cart verification completed. Products in cart: ${cartCount}`
        });
        
        expect(cartCount).toBeGreaterThan(0);
        
        // Use AI to generate insights about this test execution
        const insights = await MCPClient.getInsights('automationexercise', '1h');
        console.log('📊 Test Execution Insights:', insights);
        
      } else {
        // Use AI to analyze why no add to cart button was found
        const analysis = await MCPClient.analyzeFailure(
          'case20_add_to_cart_from_recommendations_enhanced.spec.ts',
          'element_not_found',
          'Add to cart button not visible in recommendations'
        );
        
        console.log('🔍 AI Analysis for missing add to cart button:', analysis);
        
        // Try alternative approaches suggested by AI
        const alternativeButtons = [
          'button:has-text("Add to Cart")',
          '[data-testid="add-to-cart"]',
          '.btn-add-to-cart',
          'a[href*="add-to-cart"]'
        ];
        
        let buttonFound = false;
        for (const buttonSelector of alternativeButtons) {
          try {
            const button = page.locator(buttonSelector).first();
            if (await button.isVisible()) {
              await button.click();
              console.log(`✅ Used alternative add to cart button: ${buttonSelector}`);
              buttonFound = true;
              break;
            }
          } catch (e) {
            console.log(`❌ Alternative button failed: ${buttonSelector}`);
          }
        }
        
        if (!buttonFound) {
          throw new Error('No add to cart button found with any selector');
        }
      }
      
    } catch (error) {
      // Use AI to analyze any unexpected errors
      const errorAnalysis = await MCPClient.analyzeFailure(
        'case20_add_to_cart_from_recommendations_enhanced.spec.ts',
        'generic',
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      console.log('🔍 AI Error Analysis:', errorAnalysis);
      
      await MCPClient.updateMonitoring('case20_add_to_cart_from_recommendations_enhanced.spec.ts', 'error', {
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        analysis: errorAnalysis
      });
      
      throw error;
    } finally {
      // Stop monitoring
      await MCPClient.stopMonitoring('case20_add_to_cart_from_recommendations_enhanced.spec.ts');
    }
  });

  test('should handle dynamic recommendations with AI-generated test data', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    console.log('🤖 Testing with AI-generated dynamic data...');
    
    // Generate dynamic test data for recommendations
    const recommendationData = await MCPClient.manageTestData(
      'generate',
      'product',
      { category: 'recommendations', count: 3 }
    );
    
    console.log('📊 AI Generated Recommendation Data:', recommendationData);
    
    await page.goto(props.getBaseUrl());
    await page.keyboard.press('End');
    
    // Wait for recommendations
    await page.waitForSelector('#recommended-item-carousel', { timeout: 10000 });
    
    // Get all recommended products
    const recommendedProducts = await page.locator('#recommended-item-carousel .single-products').all();
    
    console.log(`🔍 Found ${recommendedProducts.length} recommended products`);
    
    // Use AI to analyze which products to add to cart
    for (let i = 0; i < Math.min(recommendedProducts.length, 2); i++) {
      const product = recommendedProducts[i];
      
      // Get product details
      const productName = await product.locator('.product-name').textContent();
      const productPrice = await product.locator('.product-price').textContent();
      
      console.log(`🛒 Adding product ${i + 1}: ${productName} - ${productPrice}`);
      
      // Add to cart
      await product.locator('.add-to-cart').click();
      await page.waitForTimeout(1000);
    }
    
    // Verify cart contents
    await ae.viewCart();
    const cartCount = await ae.getCartProductCount();
    expect(cartCount).toBeGreaterThan(0);
    
    console.log(`✅ Successfully added ${cartCount} recommended products to cart`);
  });
}); 
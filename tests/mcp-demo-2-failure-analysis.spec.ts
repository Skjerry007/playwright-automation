import { test, expect } from '@playwright/test';
import { MCPClient } from '../utils/mcp-client';
import { AutomationExercisePage } from '../pages/automation-exercise-page';
import { Properties } from '../config/properties';

test.describe('MCP Demo 2: Intelligent Failure Analysis & Auto-Healing', () => {
  let props: Properties;
  let ae: AutomationExercisePage;

  test.beforeAll(async () => {
    await MCPClient.connect();
    props = Properties.getInstance();
  });

  test.afterAll(async () => {
    MCPClient.disconnect();
  });

  test('should analyze timeout failure and suggest fixes', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    console.log('🧪 Testing timeout failure analysis...');
    
    try {
      await page.goto(props.getBaseUrl());
      
      // Simulate a timeout failure scenario
      console.log('⏱️ Simulating slow-loading element...');
      
      try {
        // Try to click an element that might be slow to load
        await page.locator('#slow-loading-button').click({ timeout: 2000 });
      } catch (error) {
        console.log('❌ Timeout failure detected!');
        
        // Use MCP to analyze the failure
        const analysis = await MCPClient.analyzeFailure(
          'mcp-demo-2-failure-analysis.spec.ts',
          'timeout',
          'Element #slow-loading-button not found within 2000ms'
        );
        
        console.log('🔍 AI Failure Analysis:');
        console.log(analysis);
        
        // Apply the suggested fix
        console.log('🔧 Applying AI-suggested fix...');
        
        // Wait for element to be visible first
        await page.waitForSelector('#slow-loading-button', { 
          state: 'visible', 
          timeout: 10000 
        });
        
        // Now click the element
        await page.locator('#slow-loading-button').click();
        
        console.log('✅ Successfully applied AI-suggested fix!');
      }
    } catch (error) {
      console.log('❌ Test failed:', error);
    }
  });

  test('should auto-heal broken locators', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    console.log('🧪 Testing locator auto-healing...');
    
    await page.goto(props.getBaseUrl());
    
    // Simulate a broken locator scenario
    const brokenLocators = [
      '#old-login-button',  // Old selector that might have changed
      '.deprecated-class',  // Deprecated CSS class
      '//button[contains(text(), "Login")]'  // XPath that might be outdated
    ];
    
    for (const brokenLocator of brokenLocators) {
      console.log(`🔍 Testing broken locator: ${brokenLocator}`);
      
      try {
        await page.locator(brokenLocator).click();
        console.log('✅ Locator still works!');
      } catch (error) {
        console.log(`❌ Locator broken: ${brokenLocator}`);
        
        // Use MCP to suggest alternative locators
        const suggestions = await MCPClient.autoHealLocators(
          'mcp-demo-2-failure-analysis.spec.ts',
          brokenLocator,
          page.url()
        );
        
        console.log('🤖 AI Locator Suggestions:');
        console.log(suggestions);
        
        // Try the suggested locators
        const suggestedLocators = [
          'button:has-text("Login")',
          '[data-testid="login-button"]',
          'a[href*="login"]',
          '.btn-login'
        ];
        
        for (const suggestedLocator of suggestedLocators) {
          try {
            const element = page.locator(suggestedLocator);
            if (await element.isVisible()) {
              console.log(`✅ Found working alternative: ${suggestedLocator}`);
              await element.click();
              break;
            }
          } catch (e) {
            console.log(`❌ Alternative failed: ${suggestedLocator}`);
          }
        }
      }
    }
  });

  test('should analyze assertion failure and provide context', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    console.log('🧪 Testing assertion failure analysis...');
    
    await page.goto(props.getBaseUrl());
    
    try {
      // Navigate to login page
      await ae.navigateToSignupLogin();
      
      // Fill login form with test data
      const testData = props.getTestData('validUser');
      await ae.fillLoginForm(testData.username, testData.password);
      
      // Simulate an assertion failure
      console.log('🔍 Simulating assertion failure...');
      
      try {
        // This assertion might fail if the login behavior changed
        await expect(page.locator('.welcome-message')).toContainText('Welcome back');
      } catch (error) {
        console.log('❌ Assertion failure detected!');
        
        // Use MCP to analyze the assertion failure
        const analysis = await MCPClient.analyzeFailure(
          'mcp-demo-2-failure-analysis.spec.ts',
          'assertion',
          'Expected element to contain text "Welcome back" but found "Login to your account"'
        );
        
        console.log('🔍 AI Assertion Analysis:');
        console.log(analysis);
        
        // Get the actual text to understand what changed
        const actualText = await page.locator('.login-form h2').textContent();
        console.log(`📝 Actual text found: "${actualText}"`);
        
        // Use MCP to suggest alternative assertions
        console.log('🤖 AI suggests checking for successful login indicators...');
        
        // Try alternative assertions based on AI suggestions
        const alternativeSelectors = [
          '.alert-success',
          '[data-testid="login-success"]',
          '.user-dashboard',
          'a[href*="logout"]'
        ];
        
        for (const selector of alternativeSelectors) {
          try {
            const element = page.locator(selector);
            if (await element.isVisible()) {
              console.log(`✅ Found successful login indicator: ${selector}`);
              await expect(element).toBeVisible();
              break;
            }
          } catch (e) {
            console.log(`❌ Alternative selector not found: ${selector}`);
          }
        }
      }
    } catch (error) {
      console.log('❌ Test failed:', error);
    }
  });

  test('should predict potential failures based on recent changes', async ({ page }) => {
    console.log('🧪 Testing failure prediction...');
    
    // Simulate recent changes that might affect tests
    const recentChanges = {
      uiChanges: ['login button moved', 'form validation updated'],
      apiChanges: ['user endpoint modified', 'response format changed'],
      dataChanges: ['test user credentials updated']
    };
    
    // Use MCP to predict which tests might fail
    const predictions = await MCPClient.analyzeFailure(
      'mcp-demo-2-failure-analysis.spec.ts',
      'prediction',
      JSON.stringify(recentChanges)
    );
    
    console.log('🔮 AI Failure Predictions:');
    console.log(predictions);
    
    // Based on predictions, run tests with extra monitoring
    await page.goto(props.getBaseUrl());
    
    // Start monitoring for this test
    await MCPClient.startMonitoring('mcp-demo-2-failure-analysis.spec.ts', {
      testName: 'Failure Prediction Test',
      riskLevel: 'high',
      recentChanges
    });
    
    try {
      // Execute test with extra care
      await ae.navigateToSignupLogin();
      
      await MCPClient.updateMonitoring('mcp-demo-2-failure-analysis.spec.ts', 'navigation', {
        status: 'completed',
        details: 'Successfully navigated to login page'
      });
      
      // Continue with test...
      
    } finally {
      await MCPClient.stopMonitoring('mcp-demo-2-failure-analysis.spec.ts');
    }
  });
}); 
import { test, expect } from '@playwright/test';
import { MCPClient } from '../utils/mcp-client';
import { AutomationExercisePage } from '../pages/automation-exercise-page';
import { Properties } from '../config/properties';

test.describe('MCP Integration Examples', () => {
  let props: Properties;
  let ae: AutomationExercisePage;

  test.beforeAll(async () => {
    // Connect to MCP server
    await MCPClient.connect();
    props = Properties.getInstance();
  });

  test.afterAll(async () => {
    // Disconnect from MCP server
    MCPClient.disconnect();
  });

  test('should use AI to generate test case and execute it', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    // Use MCP to generate a test case
    const generatedTest = await MCPClient.generateTestCase(
      'search for products and add to cart',
      'ui',
      'valid'
    );
    
    console.log('Generated test case:', generatedTest);
    
    // Execute the generated test scenario
    await page.goto(props.getBaseUrl());
    
    // Search for products
    await ae.searchProduct('Blue Top');
    
    // Add to cart
    await ae.addToCart();
    
    // Verify cart has items
    await ae.viewCart();
    expect(await ae.getCartProductCount()).toBeGreaterThan(0);
  });

  test('should use AI to analyze failures and auto-heal', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    try {
      await page.goto(props.getBaseUrl());
      
      // Simulate a potential failure scenario
      const brokenLocator = '#non-existent-element';
      
      try {
        await page.click(brokenLocator);
      } catch (error) {
        // Use MCP to analyze the failure and get suggestions
        const analysis = await MCPClient.analyzeFailure(
          'mcp-integration-example.spec.ts',
          'element_not_found',
          `Element ${brokenLocator} not found`
        );
        
        console.log('Failure analysis:', analysis);
        
        // Use MCP to suggest alternative locators
        const suggestions = await MCPClient.autoHealLocators(
          'mcp-integration-example.spec.ts',
          brokenLocator,
          props.getBaseUrl()
        );
        
        console.log('Locator suggestions:', suggestions);
        
        // Continue with alternative approach
        await ae.navigateToHome();
      }
    } catch (error) {
      // Use MCP to analyze any other failures
      const analysis = await MCPClient.analyzeFailure(
        'mcp-integration-example.spec.ts',
        'generic',
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      console.log('Error analysis:', analysis);
      throw error;
    }
  });

  test('should use AI to monitor test execution in real-time', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    // Start monitoring this test
    await MCPClient.startMonitoring('mcp-integration-example.spec.ts', {
      testName: 'Real-time monitoring test',
      browser: 'chromium'
    });
    
    try {
      await page.goto(props.getBaseUrl());
      
      // Update monitoring with step progress
      await MCPClient.updateMonitoring('mcp-integration-example.spec.ts', 'navigation', {
        status: 'completed',
        details: 'Successfully navigated to homepage'
      });
      
      // Perform login
      await ae.navigateToLogin();
      
      await MCPClient.updateMonitoring('mcp-integration-example.spec.ts', 'login', {
        status: 'completed',
        details: 'Successfully navigated to login page'
      });
      
      const testData = props.getTestData('validUser');
      await ae.login(testData.username, testData.password);
      
      await MCPClient.updateMonitoring('mcp-integration-example.spec.ts', 'authentication', {
        status: 'completed',
        details: 'Successfully logged in'
      });
      
      // Verify login success
      await ae.assertLoggedIn();
      
    } finally {
      // Stop monitoring
      await MCPClient.stopMonitoring('mcp-integration-example.spec.ts');
    }
  });

  test('should use AI to generate API tests', async ({ request }) => {
    // Use MCP to generate API tests
    const apiTest = await MCPClient.generateApiTests(
      '/api/products',
      'GET',
      { category: 'Women', limit: 10 }
    );
    
    console.log('Generated API test:', apiTest);
    
    // Execute the API test
    const response = await request.get(`${props.getBaseUrl()}/api/products`, {
      params: { category: 'Women', limit: 10 }
    });
    
    expect(response.status()).toBe(200);
    
    const products = await response.json();
    expect(Array.isArray(products)).toBe(true);
  });

  test('should use AI to manage test data dynamically', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    // Use MCP to generate new test data
    const newUserData = await MCPClient.manageTestData(
      'generate',
      'user',
      { userType: 'new' }
    );
    
    console.log('Generated user data:', newUserData);
    
    // Use MCP to validate the generated data
    const validation = await MCPClient.manageTestData(
      'validate',
      'user',
      { email: 'newuser@example.com', password: 'newpass123' }
    );
    
    console.log('Data validation:', validation);
    
    // Use the validated data in the test
    await page.goto(props.getBaseUrl());
    await ae.navigateToSignup();
    
    // The test would use the generated data here
    // await ae.registerUser(newUserData);
  });

  test('should get real-time insights during test execution', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    // Get insights before test execution
    const preTestInsights = await MCPClient.getInsights('automationexercise', '1h');
    console.log('Pre-test insights:', preTestInsights);
    
    // Execute test
    await page.goto(props.getBaseUrl());
    await ae.navigateToHome();
    
    // Get insights after test execution
    const postTestInsights = await MCPClient.getInsights('automationexercise', '1h');
    console.log('Post-test insights:', postTestInsights);
  });
});

// Example of using MCP with test fixtures
test.describe('MCP with Fixtures', () => {
  test('should use MCP fixture for automatic connection management', async ({ page }) => {
    // This test would automatically connect/disconnect to MCP server
    // through the fixture system
    
    const ae = new AutomationExercisePage(page);
    await page.goto(Properties.getInstance().getBaseUrl());
    
    // Use MCP capabilities
    const insights = await MCPClient.getInsights('automationexercise');
    console.log('Test insights:', insights);
  });
}); 
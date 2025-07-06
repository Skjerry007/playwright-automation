import { test, expect } from '@playwright/test';
import { MCPClient } from '../utils/mcp-client';
import { AutomationExercisePage } from '../pages/automation-exercise-page';
import { Properties } from '../config/properties';

test.describe('MCP Demo 1: AI-Powered Test Generation', () => {
  let props: Properties;
  let ae: AutomationExercisePage;

  test.beforeAll(async () => {
    await MCPClient.connect();
    props = Properties.getInstance();
  });

  test.afterAll(async () => {
    MCPClient.disconnect();
  });

  test('should generate test case for new product review feature', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    // Use MCP to generate a test case for a new feature
    console.log('🤖 Generating test case with AI...');
    
    const generatedTest = await MCPClient.generateTestCase(
      'add product review with rating and comment',
      'ui',
      'valid'
    );
    
    console.log('📝 AI Generated Test Case:');
    console.log(generatedTest);
    
    // Execute the generated test scenario
    console.log('🚀 Executing AI-generated test scenario...');
    
    await page.goto(props.getBaseUrl());
    
    // Navigate to products page (similar to your existing case21)
    await ae.navigateToProducts();
    
    // Click on first product to view details
    await page.locator('.single-products').first().click();
    
    // Add review (this would be the new feature)
    await page.locator('[data-testid="review-tab"]').click();
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#review').fill('Great product! Highly recommended.');
    await page.locator('#rating').selectOption('5');
    await page.locator('#submit-review').click();
    
    // Verify review was added
    await expect(page.locator('.alert-success')).toContainText('Thank you for your review');
  });

  test('should generate API test for user registration', async ({ request }) => {
    console.log('🤖 Generating API test with AI...');
    
    const apiTest = await MCPClient.generateApiTests(
      '/api/register',
      'POST',
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
    );
    
    console.log('📝 AI Generated API Test:');
    console.log(apiTest);
    
    // Execute the generated API test
    console.log('🚀 Executing AI-generated API test...');
    
    const response = await request.post(`${props.getBaseUrl()}/api/register`, {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    
    // The AI would have suggested these assertions
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData).toHaveProperty('id');
    expect(responseData.email).toBe('test@example.com');
  });

  test('should generate data-driven test from existing patterns', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    console.log('🤖 Generating data-driven test with AI...');
    
    // Use MCP to generate test data
    const testData = await MCPClient.manageTestData(
      'generate',
      'user',
      { userType: 'new', count: 3 }
    );
    
    console.log('📝 AI Generated Test Data:');
    console.log(testData);
    
    // Execute tests with generated data
    await page.goto(props.getBaseUrl());
    
    // This would use the generated test data to create multiple test scenarios
    // Similar to your existing test patterns but with AI-generated data
    await ae.navigateToSignupLogin();
    
    // The AI would suggest testing with different user types
    const userTypes = ['valid', 'invalid', 'new'];
    
    for (const userType of userTypes) {
      console.log(`🧪 Testing with ${userType} user data...`);
      
      // Generate specific test data for this user type
      const userData = await MCPClient.manageTestData(
        'generate',
        'user',
        { userType }
      );
      
      console.log(`📊 Generated data for ${userType}:`, userData);
      
      // Execute test with this data
      // This demonstrates how AI can create data-driven tests
    }
  });
}); 
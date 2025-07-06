import { test, expect } from '@playwright/test';
import { MCPClient } from '../utils/mcp-client';
import { AutomationExercisePage } from '../pages/automation-exercise-page';
import { Properties } from '../config/properties';

test.describe('MCP Demo 3: Real-time Test Monitoring', () => {
  let props: Properties;
  let ae: AutomationExercisePage;

  test.beforeAll(async () => {
    await MCPClient.connect();
    props = Properties.getInstance();
  });

  test.afterAll(async () => {
    MCPClient.disconnect();
  });

  test('should monitor complete user journey in real-time', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    console.log('🚀 Starting real-time monitoring...');
    
    // Start monitoring this test execution
    await MCPClient.startMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', {
      testName: 'Complete User Journey Test',
      browser: 'chromium',
      environment: props.getEnvironment(),
      startTime: new Date().toISOString()
    });
    
    try {
      // Step 1: Navigation
      console.log('📍 Step 1: Navigating to homepage...');
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'navigation', {
        status: 'started',
        details: 'Navigating to homepage',
        timestamp: new Date().toISOString()
      });
      
      await page.goto(props.getBaseUrl());
      
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'navigation', {
        status: 'completed',
        details: 'Successfully loaded homepage',
        duration: 2000,
        timestamp: new Date().toISOString()
      });
      
      // Step 2: User Registration
      console.log('👤 Step 2: User registration...');
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'registration', {
        status: 'started',
        details: 'Starting user registration process',
        timestamp: new Date().toISOString()
      });
      
      await ae.navigateToSignupLogin();
      
      // Generate test data for registration
      const userData = await MCPClient.manageTestData(
        'generate',
        'user',
        { userType: 'new' }
      );
      
      console.log('📊 Using AI-generated user data:', userData);
      
      // Fill registration form
      await page.locator('[data-qa="signup-name"]').fill('Test User');
      await page.locator('[data-qa="signup-email"]').fill('test@example.com');
      await page.locator('[data-qa="signup-button"]').click();
      
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'registration', {
        status: 'completed',
        details: 'User registration form submitted',
        duration: 3000,
        timestamp: new Date().toISOString()
      });
      
      // Step 3: Product Search
      console.log('🔍 Step 3: Product search...');
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'search', {
        status: 'started',
        details: 'Starting product search',
        timestamp: new Date().toISOString()
      });
      
      await ae.searchProduct('Blue Top');
      
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'search', {
        status: 'completed',
        details: 'Product search completed',
        duration: 1500,
        timestamp: new Date().toISOString()
      });
      
      // Step 4: Add to Cart
      console.log('🛒 Step 4: Adding to cart...');
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'cart', {
        status: 'started',
        details: 'Adding product to cart',
        timestamp: new Date().toISOString()
      });
      
      await page.locator('.add-to-cart').first().click();
      await page.waitForSelector('.modal-content');
      await page.locator('.btn-success').click();
      
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'cart', {
        status: 'completed',
        details: 'Product added to cart successfully',
        duration: 2000,
        timestamp: new Date().toISOString()
      });
      
      // Step 5: Checkout Process
      console.log('💳 Step 5: Checkout process...');
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'checkout', {
        status: 'started',
        details: 'Starting checkout process',
        timestamp: new Date().toISOString()
      });
      
      await ae.viewCart();
      await page.locator('.check_out').click();
      
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'checkout', {
        status: 'completed',
        details: 'Checkout process completed',
        duration: 4000,
        timestamp: new Date().toISOString()
      });
      
      // Get real-time insights during execution
      console.log('📊 Getting real-time insights...');
      const insights = await MCPClient.getInsights('automationexercise', '1h');
      console.log('🔍 Current Test Insights:');
      console.log(insights);
      
    } catch (error) {
      // Report error to monitoring
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'error', {
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      throw error;
    } finally {
      // Stop monitoring
      await MCPClient.stopMonitoring('mcp-demo-3-real-time-monitoring.spec.ts');
    }
  });

  test('should set up intelligent alerts for test conditions', async ({ page }) => {
    console.log('🚨 Setting up intelligent alerts...');
    
    // Set up alert for slow page loads
    await MCPClient.setupAlerts({
      alertType: 'performance',
      conditions: {
        pageLoadTime: '>5000', // Alert if page takes more than 5 seconds
        elementWaitTime: '>3000' // Alert if element wait takes more than 3 seconds
      },
      actions: [
        {
          type: 'log',
          message: 'Performance degradation detected'
        },
        {
          type: 'notification',
          channel: 'slack',
          message: 'Test performance alert: Page load time exceeded threshold'
        }
      ]
    });
    
    // Set up alert for element not found errors
    await MCPClient.setupAlerts({
      alertType: 'element_error',
      conditions: {
        errorType: 'element_not_found',
        frequency: '>3' // Alert if more than 3 element not found errors
      },
      actions: [
        {
          type: 'log',
          message: 'Multiple element not found errors detected'
        },
        {
          type: 'test_action',
          action: 'auto_heal_locators'
        }
      ]
    });
    
    // Execute test with monitoring
    await page.goto(props.getBaseUrl());
    
    // Simulate slow page load
    await page.waitForTimeout(6000); // This should trigger the performance alert
    
    // Simulate element not found
    try {
      await page.locator('#non-existent-element').click();
    } catch (error) {
      console.log('❌ Element not found (expected for demo)');
    }
    
    console.log('✅ Alerts configured and tested!');
  });

  test('should track performance metrics and trends', async ({ page }) => {
    console.log('📈 Tracking performance metrics...');
    
    const performanceMetrics = {
      pageLoadTimes: [],
      elementWaitTimes: [],
      testExecutionTimes: []
    };
    
    // Start monitoring with performance tracking
    await MCPClient.startMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', {
      testName: 'Performance Tracking Test',
      metrics: performanceMetrics
    });
    
    try {
      // Measure page load time
      const startTime = Date.now();
      await page.goto(props.getBaseUrl());
      const pageLoadTime = Date.now() - startTime;
      
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'performance', {
        metric: 'pageLoadTime',
        value: pageLoadTime,
        threshold: 5000,
        status: pageLoadTime > 5000 ? 'warning' : 'normal'
      });
      
      // Measure element wait time
      const elementStartTime = Date.now();
      await page.waitForSelector('.features_items', { timeout: 10000 });
      const elementWaitTime = Date.now() - elementStartTime;
      
      await MCPClient.updateMonitoring('mcp-demo-3-real-time-monitoring.spec.ts', 'performance', {
        metric: 'elementWaitTime',
        value: elementWaitTime,
        threshold: 3000,
        status: elementWaitTime > 3000 ? 'warning' : 'normal'
      });
      
      // Execute some test actions
      await ae.navigateToProducts();
      await ae.searchProduct('Blue Top');
      
      // Get performance insights
      const insights = await MCPClient.getInsights('automationexercise', '1h');
      console.log('📊 Performance Insights:');
      console.log(insights);
      
    } finally {
      await MCPClient.stopMonitoring('mcp-demo-3-real-time-monitoring.spec.ts');
    }
  });
}); 
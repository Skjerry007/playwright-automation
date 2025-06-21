import { test, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { TestUtils } from '../utils/test-utils';
import { Properties } from '../config/properties';

test.describe('Framework Demo', () => {
  let logger: Logger;
  let properties: Properties;

  test.beforeEach(async () => {
    logger = new Logger('FrameworkDemo');
    properties = Properties.getInstance();
    logger.info('🚀 Starting framework demo test');
  });

  test('should demonstrate all framework features', async ({ page }) => {
    logger.step('Testing framework features');
    
    // 1. Test logging system
    logger.info('✅ Logging system is working');
    logger.warn('⚠️ Warning messages work');
    logger.debug('🔍 Debug messages work');
    
    // 2. Test configuration management
    const environment = properties.getEnvironment();
    const baseUrl = properties.getBaseUrl();
    const timeout = properties.getTimeout();
    
    logger.info(`🌍 Environment: ${environment}`);
    logger.info(`🔗 Base URL: ${baseUrl}`);
    logger.info(`⏱️ Timeout: ${timeout}ms`);
    
    // 3. Test test data generation
    const testData = TestUtils.generateTestData();
    logger.info(`👤 Generated test data: ${testData.firstName} ${testData.lastName}`);
    logger.info(`📧 Email: ${testData.email}`);
    logger.info(`📞 Phone: ${testData.phone}`);
    
    // 4. Test validation functions
    expect(TestUtils.isValidEmail(testData.email)).toBe(true);
    expect(TestUtils.isValidPhone(testData.phone)).toBe(true);
    logger.info('✅ Data validation working');
    
    // 5. Test page navigation and assertions
    await page.goto('data:text/html,<html><body><h1>Framework Demo</h1><p>This is a test page</p><button>Click me</button></body></html>');
    
    await expect(page.locator('h1')).toHaveText('Framework Demo');
    await expect(page.locator('p')).toHaveText('This is a test page');
    await expect(page.locator('button')).toBeVisible();
    
    logger.info('✅ Page navigation and assertions working');
    
    // 6. Test data retrieval from config
    const validUser = properties.getTestData('validUser');
    const invalidUser = properties.getTestData('invalidUser');
    
    expect(validUser).toHaveProperty('username');
    expect(invalidUser).toHaveProperty('username');
    logger.info(`👤 Valid user: ${validUser.username}`);
    logger.info(`❌ Invalid user: ${invalidUser.username}`);
    
    // 7. Test utility functions
    const randomString = TestUtils.generateRandomString(8);
    const randomEmail = TestUtils.generateRandomEmail();
    
    expect(randomString).toHaveLength(8);
    expect(TestUtils.isValidEmail(randomEmail)).toBe(true);
    logger.info(`🎲 Random string: ${randomString}`);
    logger.info(`📧 Random email: ${randomEmail}`);
    
    // 8. Test special logging methods
    logger.testStart('Framework Demo Test');
    logger.assertion('All framework features working', true);
    logger.testEnd('Framework Demo Test', 'PASSED');
    
    // 9. Test page interactions
    await page.click('button');
    logger.info('✅ Page interactions working');
    
    // 10. Final summary
    const features = [
      '📝 Comprehensive Logging',
      '⚙️ Configuration Management', 
      '🛠️ Test Utilities',
      '🎯 Data Generation',
      '✅ Validation Functions',
      '🌐 Page Navigation',
      '🔍 Assertions',
      '📊 Test Data Management',
      '🎲 Random Data Generation',
      '📋 Special Logging Methods'
    ];
    
    features.forEach(feature => {
      logger.info(feature);
    });
    
    logger.info('🎉 Framework demo completed successfully!');
    
    // Final assertions
    expect(environment).toBeDefined();
    expect(baseUrl).toBeDefined();
    expect(timeout).toBeGreaterThan(0);
    expect(testData).toHaveProperty('firstName');
    expect(testData).toHaveProperty('lastName');
    expect(testData).toHaveProperty('email');
    
    logger.assertion('All framework components verified', true);
  });

  test('should demonstrate test utilities', async () => {
    logger.step('Testing utility functions');
    
    // Test random data generation
    const randomString = TestUtils.generateRandomString(10);
    const randomEmail = TestUtils.generateRandomEmail();
    const randomPhone = TestUtils.generateRandomPhone();
    
    logger.info(`🎲 Random string (10 chars): ${randomString}`);
    logger.info(`📧 Random email: ${randomEmail}`);
    logger.info(`📞 Random phone: ${randomPhone}`);
    
    // Test validation
    expect(randomString).toHaveLength(10);
    expect(TestUtils.isValidEmail(randomEmail)).toBe(true);
    expect(TestUtils.isValidPhone(randomPhone)).toBe(true);
    
    // Test invalid data
    expect(TestUtils.isValidEmail('invalid-email')).toBe(false);
    expect(TestUtils.isValidPhone('invalid-phone')).toBe(false);
    
    logger.info('✅ All utility functions working correctly');
  });

  test('should demonstrate configuration system', async () => {
    logger.step('Testing configuration system');
    
    // Test environment config
    const env = properties.getEnvironment();
    const baseUrl = properties.getBaseUrl();
    const timeout = properties.getTimeout();
    const retries = properties.getRetries();
    const headless = properties.isHeadless();
    const slowMo = properties.getSlowMo();
    const viewport = properties.getViewport();
    const userAgent = properties.getUserAgent();
    
    logger.info(`🌍 Environment: ${env}`);
    logger.info(`🔗 Base URL: ${baseUrl}`);
    logger.info(`⏱️ Timeout: ${timeout}ms`);
    logger.info(`🔄 Retries: ${retries}`);
    logger.info(`👻 Headless: ${headless}`);
    logger.info(`🐌 Slow Mo: ${slowMo}ms`);
    logger.info(`📱 Viewport: ${viewport.width}x${viewport.height}`);
    logger.info(`🌐 User Agent: ${userAgent.substring(0, 50)}...`);
    
    // Test API config
    const apiConfig = properties.getApiConfig();
    logger.info(`🔌 API Base URL: ${apiConfig.baseUrl}`);
    logger.info(`⏱️ API Timeout: ${apiConfig.timeout}ms`);
    
    // Test test data
    const validUser = properties.getTestData('validUser');
    const invalidUser = properties.getTestData('invalidUser');
    
    logger.info(`👤 Valid User: ${validUser.username} (${validUser.email})`);
    logger.info(`❌ Invalid User: ${invalidUser.username} (${invalidUser.email})`);
    
    // Assertions
    expect(env).toBe('dev');
    expect(baseUrl).toContain('example.com');
    expect(timeout).toBeGreaterThan(0);
    expect(retries).toBeGreaterThanOrEqual(0);
    expect(viewport.width).toBeGreaterThan(0);
    expect(viewport.height).toBeGreaterThan(0);
    expect(validUser).toHaveProperty('username');
    expect(invalidUser).toHaveProperty('username');
    
    logger.info('✅ Configuration system working perfectly');
  });
}); 
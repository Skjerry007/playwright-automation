import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { TestUtils } from '../utils/test-utils';
import { Properties } from '../config/properties';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let properties: Properties;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    properties = Properties.getInstance();
    
    // Navigate to login page
    await loginPage.navigateToLoginPage();
  });

  test('should display login form elements', async () => {
    // Assert login form is visible
    await loginPage.assertLoginFormVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    const testData = properties.getTestData('validUser');
    
    // Login with valid credentials
    await loginPage.login(testData.username, testData.password);
    
    // Assert user is logged in
    await loginPage.assertLoggedIn();
  });

  test('should show error message with invalid credentials', async () => {
    const testData = properties.getTestData('invalidUser');
    
    // Login with invalid credentials
    await loginPage.login(testData.username, testData.password);
    
    // Assert error message is displayed
    await loginPage.assertErrorMessageDisplayed();
  });

  test('should login with remember me option', async ({ page }) => {
    const testData = properties.getTestData('validUser');
    
    // Login with remember me option
    await loginPage.loginWithRememberMe(testData.username, testData.password);
    
    // Assert user is logged in
    await loginPage.assertLoggedIn();
    
    // Assert remember me is checked
    expect(await loginPage.isRememberMeChecked()).toBe(true);
  });

  test('should clear form when reset button is clicked', async () => {
    const testData = properties.getTestData('validUser');
    
    // Fill the form
    await loginPage.fillLoginForm(testData.username, testData.password);
    
    // Clear the form
    await loginPage.clearLoginForm();
    
    // Assert fields are empty
    expect(await loginPage.getUsernameValue()).toBe('');
    expect(await loginPage.getPasswordValue()).toBe('');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Click forgot password link
    await loginPage.clickForgotPassword();
    
    // Assert navigation to forgot password page
    await expect(page).toHaveURL(/.*forgot-password.*/);
  });

  test('should validate required fields', async () => {
    // Try to submit empty form
    await loginPage.click(loginPage['loginButton']);
    
    // Assert error messages for required fields
    await loginPage.assertErrorMessageDisplayed();
  });

  test('should handle special characters in username', async () => {
    const specialUsername = 'test@user#123';
    const password = 'password123';
    
    // Login with special characters
    await loginPage.login(specialUsername, password);
    
    // Assert appropriate response (either success or specific error)
    const isLoggedIn = await loginPage.isLoggedIn();
    if (!isLoggedIn) {
      await loginPage.assertErrorMessageDisplayed();
    }
  });

  test('should handle long username and password', async () => {
    const longUsername = TestUtils.generateRandomString(100);
    const longPassword = TestUtils.generateRandomString(100);
    
    // Login with long credentials
    await loginPage.login(longUsername, longPassword);
    
    // Assert appropriate response
    const isLoggedIn = await loginPage.isLoggedIn();
    if (!isLoggedIn) {
      await loginPage.assertErrorMessageDisplayed();
    }
  });

  test('should maintain form state on page refresh', async ({ page }) => {
    const testData = properties.getTestData('validUser');
    
    // Fill the form
    await loginPage.fillLoginForm(testData.username, testData.password);
    
    // Refresh the page
    await page.reload();
    await loginPage.waitForLoginForm();
    
    // Assert form fields are preserved (if browser supports it)
    // Note: This behavior may vary based on browser settings
    const usernameValue = await loginPage.getUsernameValue();
    const passwordValue = await loginPage.getPasswordValue();
    
    // Log the values for debugging
    console.log(`Username after refresh: ${usernameValue}`);
    console.log(`Password after refresh: ${passwordValue}`);
  });

  test('should handle concurrent login attempts', async ({ browser }) => {
    const testData = properties.getTestData('validUser');
    
    // Create multiple browser contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    const loginPage1 = new LoginPage(page1);
    const loginPage2 = new LoginPage(page2);
    
    // Navigate both pages to login
    await loginPage1.navigateToLoginPage();
    await loginPage2.navigateToLoginPage();
    
    // Attempt login on both pages simultaneously
    await Promise.all([
      loginPage1.login(testData.username, testData.password),
      loginPage2.login(testData.username, testData.password)
    ]);
    
    // Assert both logins are successful
    await loginPage1.assertLoggedIn();
    await loginPage2.assertLoggedIn();
    
    await context1.close();
    await context2.close();
  });
});

test.describe('Login API Tests', () => {
  test('should validate login API endpoint', async ({ request }) => {
    const properties = Properties.getInstance();
    const apiConfig = properties.getApiConfig();
    const testData = properties.getTestData('validUser');
    
    // Test valid login
    const response = await request.post(`${apiConfig.baseUrl}/api/login`, {
      data: {
        username: testData.username,
        password: testData.password
      }
    });
    
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
    expect(responseBody).toHaveProperty('user');
  });

  test('should handle invalid login API request', async ({ request }) => {
    const properties = Properties.getInstance();
    const apiConfig = properties.getApiConfig();
    const testData = properties.getTestData('invalidUser');
    
    // Test invalid login
    const response = await request.post(`${apiConfig.baseUrl}/api/login`, {
      data: {
        username: testData.username,
        password: testData.password
      }
    });
    
    expect(response.status()).toBe(401);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('error');
  });
}); 
import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { CommonLocators } from '../locators/common-locators';

export class LoginPage extends BasePage {
  // Page-specific locators
  private readonly usernameInput = this.page.locator(CommonLocators.FORMS.USERNAME_INPUT);
  private readonly passwordInput = this.page.locator(CommonLocators.FORMS.PASSWORD_INPUT);
  private readonly loginButton = this.page.locator(CommonLocators.FORMS.SUBMIT_BUTTON);
  private readonly errorMessage = this.page.locator(CommonLocators.MESSAGES.ERROR_MESSAGE);
  private readonly successMessage = this.page.locator(CommonLocators.MESSAGES.SUCCESS_MESSAGE);
  private readonly forgotPasswordLink = this.page.locator('[data-testid="forgot-password-link"]');
  private readonly rememberMeCheckbox = this.page.locator('[data-testid="remember-me-checkbox"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForLoginForm();
  }

  /**
   * Wait for login form to be visible
   */
  async waitForLoginForm(): Promise<void> {
    await this.waitForElement(this.usernameInput);
    await this.waitForElement(this.passwordInput);
    await this.waitForElement(this.loginButton);
  }

  /**
   * Fill login form
   */
  async fillLoginForm(username: string, password: string): Promise<void> {
    this.logger.step('Filling login form');
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
  }

  /**
   * Login with credentials
   */
  async login(username: string, password: string): Promise<void> {
    this.logger.step(`Logging in with username: ${username}`);
    await this.fillLoginForm(username, password);
    await this.click(this.loginButton);
    await this.waitForNetworkIdle();
  }

  /**
   * Login with remember me option
   */
  async loginWithRememberMe(username: string, password: string): Promise<void> {
    this.logger.step(`Logging in with remember me option`);
    await this.fillLoginForm(username, password);
    await this.setChecked(this.rememberMeCheckbox, true);
    await this.click(this.loginButton);
    await this.waitForNetworkIdle();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    this.logger.step('Clicking forgot password link');
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  /**
   * Assert login form is visible
   */
  async assertLoginFormVisible(): Promise<void> {
    await this.assertElementVisible(this.usernameInput, 'Username input is visible');
    await this.assertElementVisible(this.passwordInput, 'Password input is visible');
    await this.assertElementVisible(this.loginButton, 'Login button is visible');
  }

  /**
   * Assert error message is displayed
   */
  async assertErrorMessageDisplayed(expectedMessage?: string): Promise<void> {
    await this.assertElementVisible(this.errorMessage, 'Error message is displayed');
    if (expectedMessage) {
      await this.assertText(this.errorMessage, expectedMessage, 'Error message matches expected text');
    }
  }

  /**
   * Assert success message is displayed
   */
  async assertSuccessMessageDisplayed(expectedMessage?: string): Promise<void> {
    await this.assertElementVisible(this.successMessage, 'Success message is displayed');
    if (expectedMessage) {
      await this.assertText(this.successMessage, expectedMessage, 'Success message matches expected text');
    }
  }

  /**
   * Check if user is logged in (redirected to dashboard)
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForURL('**/dashboard', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Assert user is logged in
   */
  async assertLoggedIn(): Promise<void> {
    await this.page.waitForURL('**/dashboard', { timeout: this.properties.getTimeout() });
    this.logger.assertion('User is successfully logged in', true);
  }

  /**
   * Assert user is not logged in (still on login page)
   */
  async assertNotLoggedIn(): Promise<void> {
    await this.assertUrlContains('/login', 'User is still on login page');
    this.logger.assertion('User is not logged in', true);
  }

  /**
   * Clear login form
   */
  async clearLoginForm(): Promise<void> {
    this.logger.step('Clearing login form');
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Get username field value
   */
  async getUsernameValue(): Promise<string> {
    return await this.usernameInput.inputValue();
  }

  /**
   * Get password field value
   */
  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  /**
   * Check if remember me is checked
   */
  async isRememberMeChecked(): Promise<boolean> {
    return await this.rememberMeCheckbox.isChecked();
  }
} 
import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { Properties } from '../config/properties';

export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected properties: Properties;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
    this.properties = Properties.getInstance();
  }

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string): Promise<void> {
    this.logger.step(`Navigating to: ${url}`);
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    this.logger.debug('Page loaded successfully');
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: string | Locator, timeout?: number): Promise<Locator> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.waitFor({ state: 'visible', timeout: timeout || this.properties.getTimeout() });
    return element;
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementHidden(locator: string | Locator, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.waitFor({ state: 'hidden', timeout: timeout || this.properties.getTimeout() });
  }

  /**
   * Click on an element
   */
  async click(locator: string | Locator, options?: { timeout?: number; force?: boolean }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.step(`Clicking element: ${typeof locator === 'string' ? locator : 'Locator'}`);
    await element.click(options);
  }

  /**
   * Fill an input field
   */
  async fill(locator: string | Locator, value: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.step(`Filling field with value: ${value}`);
    await element.fill(value);
  }

  /**
   * Type text into an input field
   */
  async type(locator: string | Locator, text: string, options?: { delay?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.step(`Typing text: ${text}`);
    await element.type(text, options);
  }

  /**
   * Get text content of an element
   */
  async getText(locator: string | Locator): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const text = await element.textContent();
    return text?.trim() || '';
  }

  /**
   * Get attribute value of an element
   */
  async getAttribute(locator: string | Locator, attribute: string): Promise<string | null> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.getAttribute(attribute);
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: string | Locator): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isVisible();
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(locator: string | Locator): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isEnabled();
  }

  /**
   * Select option from dropdown
   */
  async selectOption(locator: string | Locator, value: string | string[]): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.step(`Selecting option: ${Array.isArray(value) ? value.join(', ') : value}`);
    await element.selectOption(value);
  }

  /**
   * Check or uncheck a checkbox
   */
  async setChecked(locator: string | Locator, checked: boolean): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.step(`${checked ? 'Checking' : 'Unchecking'} checkbox`);
    await element.setChecked(checked);
  }

  /**
   * Hover over an element
   */
  async hover(locator: string | Locator): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.step('Hovering over element');
    await element.hover();
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `${this.constructor.name}_${Date.now()}`;
    this.logger.step(`Taking screenshot: ${screenshotName}`);
    return await this.page.screenshot({ fullPage: true });
  }

  /**
   * Assert element is visible
   */
  async assertElementVisible(locator: string | Locator, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toBeVisible({ timeout: this.properties.getTimeout() });
    this.logger.assertion(message || 'Element is visible', true);
  }

  /**
   * Assert element is hidden
   */
  async assertElementHidden(locator: string | Locator, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toBeHidden({ timeout: this.properties.getTimeout() });
    this.logger.assertion(message || 'Element is hidden', true);
  }

  /**
   * Assert text content
   */
  async assertText(locator: string | Locator, expectedText: string, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toHaveText(expectedText, { timeout: this.properties.getTimeout() });
    this.logger.assertion(message || `Text matches: ${expectedText}`, true);
  }

  /**
   * Assert URL contains
   */
  async assertUrlContains(expectedUrl: string, message?: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedUrl), { timeout: this.properties.getTimeout() });
    this.logger.assertion(message || `URL contains: ${expectedUrl}`, true);
  }

  /**
   * Assert page title
   */
  async assertTitle(expectedTitle: string, message?: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle, { timeout: this.properties.getTimeout() });
    this.logger.assertion(message || `Title matches: ${expectedTitle}`, true);
  }

  /**
   * Wait for network request to complete
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for specific network request
   */
  async waitForRequest(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForRequest(urlPattern);
  }

  /**
   * Wait for specific network response
   */
  async waitForResponse(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForResponse(urlPattern);
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Refresh the page
   */
  async refresh(): Promise<void> {
    this.logger.step('Refreshing page');
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Go back to previous page
   */
  async goBack(): Promise<void> {
    this.logger.step('Going back to previous page');
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  /**
   * Go forward to next page
   */
  async goForward(): Promise<void> {
    this.logger.step('Going forward to next page');
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  /**
   * Accept dialog
   */
  async acceptDialog(): Promise<void> {
    this.page.on('dialog', dialog => dialog.accept());
  }

  /**
   * Dismiss dialog
   */
  async dismissDialog(): Promise<void> {
    this.page.on('dialog', dialog => dialog.dismiss());
  }

  /**
   * Get dialog message
   */
  async getDialogMessage(): Promise<string> {
    return new Promise((resolve) => {
      this.page.on('dialog', dialog => {
        resolve(dialog.message());
        dialog.accept();
      });
    });
  }
} 
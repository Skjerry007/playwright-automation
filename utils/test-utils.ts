import { Page, expect } from '@playwright/test';
import { Logger } from './logger';
import { Properties } from '../config/properties';

export class TestUtils {
  private static logger = new Logger('TestUtils');
  private static properties = Properties.getInstance();

  /**
   * Generate random string
   */
  static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    const randomString = this.generateRandomString(8);
    return `${randomString}@example.com`;
  }

  /**
   * Generate random phone number
   */
  static generateRandomPhone(): string {
    const digits = '0123456789';
    let phone = '+1';
    for (let i = 0; i < 10; i++) {
      phone += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return phone;
  }

  /**
   * Wait for a specific condition
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 100
  ): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        if (await condition()) {
          return true;
        }
      } catch (error) {
        // Continue waiting
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    return false;
  }

  /**
   * Retry a function with exponential backoff
   */
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        this.logger.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  /**
   * Take screenshot on test failure
   */
  static async takeScreenshotOnFailure(page: Page, testName: string): Promise<void> {
    try {
      const screenshot = await page.screenshot({ fullPage: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `failure_${testName}_${timestamp}.png`;
      
      // Save screenshot to test-results directory
      const fs = require('fs');
      const path = require('path');
      const screenshotPath = path.join(process.cwd(), 'test-results', filename);
      
      fs.writeFileSync(screenshotPath, screenshot);
      this.logger.info(`Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      this.logger.error('Failed to take screenshot', error as Error);
    }
  }

  /**
   * Assert element exists and is visible
   */
  static async assertElementExists(page: Page, selector: string, timeout?: number): Promise<void> {
    const element = page.locator(selector);
    await expect(element).toBeVisible({ timeout: timeout || this.properties.getTimeout() });
  }

  /**
   * Assert element does not exist
   */
  static async assertElementNotExists(page: Page, selector: string, timeout?: number): Promise<void> {
    const element = page.locator(selector);
    await expect(element).not.toBeVisible({ timeout: timeout || this.properties.getTimeout() });
  }

  /**
   * Assert text contains
   */
  static async assertTextContains(page: Page, selector: string, expectedText: string): Promise<void> {
    const element = page.locator(selector);
    await expect(element).toContainText(expectedText);
  }

  /**
   * Assert URL equals
   */
  static async assertUrlEquals(page: Page, expectedUrl: string): Promise<void> {
    await expect(page).toHaveURL(expectedUrl);
  }

  /**
   * Assert page title contains
   */
  static async assertTitleContains(page: Page, expectedTitle: string): Promise<void> {
    await expect(page).toHaveTitle(new RegExp(expectedTitle));
  }

  /**
   * Wait for element to be present in DOM
   */
  static async waitForElementPresent(page: Page, selector: string, timeout?: number): Promise<void> {
    const element = page.locator(selector);
    await element.waitFor({ state: 'attached', timeout: timeout || this.properties.getTimeout() });
  }

  /**
   * Wait for element to be detached from DOM
   */
  static async waitForElementDetached(page: Page, selector: string, timeout?: number): Promise<void> {
    const element = page.locator(selector);
    await element.waitFor({ state: 'detached', timeout: timeout || this.properties.getTimeout() });
  }

  /**
   * Get element count
   */
  static async getElementCount(page: Page, selector: string): Promise<number> {
    const elements = page.locator(selector);
    return await elements.count();
  }

  /**
   * Assert element count
   */
  static async assertElementCount(page: Page, selector: string, expectedCount: number): Promise<void> {
    const actualCount = await this.getElementCount(page, selector);
    expect(actualCount).toBe(expectedCount);
  }

  /**
   * Get all text from elements
   */
  static async getAllText(page: Page, selector: string): Promise<string[]> {
    const elements = page.locator(selector);
    const count = await elements.count();
    const texts: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await elements.nth(i).textContent();
      if (text) {
        texts.push(text.trim());
      }
    }
    
    return texts;
  }

  /**
   * Assert array contains
   */
  static assertArrayContains(array: any[], item: any): void {
    expect(array).toContain(item);
  }

  /**
   * Assert array length
   */
  static assertArrayLength(array: any[], expectedLength: number): void {
    expect(array).toHaveLength(expectedLength);
  }

  /**
   * Format date for testing
   */
  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }

  /**
   * Get current timestamp
   */
  static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Sleep for specified milliseconds
   */
  static async sleep(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate test data
   */
  static generateTestData() {
    return {
      firstName: this.generateRandomString(8),
      lastName: this.generateRandomString(8),
      email: this.generateRandomEmail(),
      phone: this.generateRandomPhone(),
      address: `${this.generateRandomString(10)} Street`,
      city: this.generateRandomString(8),
      zipCode: this.generateRandomString(5),
      company: this.generateRandomString(10) + ' Inc.'
    };
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  }

  /**
   * Clean up test data
   */
  static async cleanupTestData(): Promise<void> {
    this.logger.info('Cleaning up test data');
    // Implement cleanup logic here
    // Example: Delete test users, clear test files, etc.
  }
} 
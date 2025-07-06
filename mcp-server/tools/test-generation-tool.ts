import { Logger } from '../../utils/logger.js';
import { Properties } from '../../config/properties.js';
import * as fs from 'fs';
import * as path from 'path';

export class TestGenerationTool {
  private static logger = new Logger('TestGenerationTool');
  private static properties = Properties.getInstance();

  /**
   * Generate a new test case based on existing patterns
   */
  static async generateTestCase(args: any) {
    const { testType, scenario, userType = 'valid' } = args;
    
    this.logger.info(`Generating test case: ${testType} - ${scenario}`);
    
    // Analyze existing test patterns
    const existingTests = await this.analyzeExistingTests();
    const testTemplate = this.getTestTemplate(testType, existingTests);
    
    // Generate test data
    const testData = await this.generateTestData(userType);
    
    // Create the test case
    const testCase = this.createTestCase(testTemplate, scenario, testData);
    
    return {
      content: [
        {
          type: 'text',
          text: `Generated test case for ${scenario}:\n\n${testCase}`
        }
      ]
    };
  }

  /**
   * Auto-heal broken locators
   */
  static async autoHealLocators(args: any) {
    const { testFile, brokenLocator, pageUrl } = args;
    
    this.logger.info(`Auto-healing locator in ${testFile}`);
    
    // This would integrate with Playwright's built-in locator suggestions
    const suggestedLocators = await this.suggestLocators(pageUrl, brokenLocator);
    
    return {
      content: [
        {
          type: 'text',
          text: `Suggested locators for ${brokenLocator}:\n\n${suggestedLocators.join('\n')}`
        }
      ]
    };
  }

  /**
   * Generate API tests based on existing patterns
   */
  static async generateApiTests(args: any) {
    const { endpoint, method, testData } = args;
    
    this.logger.info(`Generating API test for ${method} ${endpoint}`);
    
    const apiTest = this.createApiTest(endpoint, method, testData);
    
    return {
      content: [
        {
          type: 'text',
          text: `Generated API test:\n\n${apiTest}`
        }
      ]
    };
  }

  private static async analyzeExistingTests() {
    const testsDir = path.join(process.cwd(), 'tests', 'automationexercise');
    const testFiles = fs.readdirSync(testsDir).filter(file => file.endsWith('.spec.ts'));
    
    const patterns = {
      imports: new Set<string>(),
      pageObjects: new Set<string>(),
      assertions: new Set<string>(),
      testStructure: [] as string[]
    };

    for (const file of testFiles.slice(0, 5)) { // Analyze first 5 files for patterns
      const content = fs.readFileSync(path.join(testsDir, file), 'utf8');
      
      // Extract import patterns
      const importMatches = content.match(/import.*from.*['"]/g);
      importMatches?.forEach(match => patterns.imports.add(match));
      
      // Extract page object usage
      const pageMatches = content.match(/new \w+Page\(/g);
      pageMatches?.forEach(match => patterns.pageObjects.add(match));
      
      // Extract assertion patterns
      const assertionMatches = content.match(/expect\(.*\)\./g);
      assertionMatches?.forEach(match => patterns.assertions.add(match));
    }

    return patterns;
  }

  private static getTestTemplate(testType: string, patterns: any) {
    const baseTemplate = `import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';

test.describe('Generated Test Case', () => {
  test('should perform the specified action', async ({ page }) => {
    const props = Properties.getInstance();
    const ae = new AutomationExercisePage(page);
    
    await page.goto(props.getBaseUrl());
    
    // Test implementation will be generated here
  });
});`;

    return baseTemplate;
  }

  private static async generateTestData(userType: string) {
    const testData = this.properties.getTestData(userType);
    return testData || this.properties.getTestData('validUser');
  }

  private static createTestCase(template: string, scenario: string, testData: any) {
    // Replace placeholders with actual test logic
    let testCase = template.replace(
      'should perform the specified action',
      `should ${scenario.toLowerCase()}`
    );

    // Add test data usage
    const testDataUsage = `
    const testData = props.getTestData('${Object.keys(testData)[0]}');
    `;

    testCase = testCase.replace(
      'await page.goto(props.getBaseUrl());',
      `await page.goto(props.getBaseUrl());
    ${testDataUsage}`
    );

    return testCase;
  }

  private static async suggestLocators(pageUrl: string, brokenLocator: string) {
    // This would integrate with Playwright's locator suggestions
    // For now, return common locator strategies
    return [
      `page.locator('text=${brokenLocator}')`,
      `page.locator('[data-testid="${brokenLocator}"]')`,
      `page.locator('css=${brokenLocator}')`,
      `page.locator('xpath=//*[contains(text(),"${brokenLocator}")]')`
    ];
  }

  private static createApiTest(endpoint: string, method: string, testData: any) {
    return `import { test, expect } from '@playwright/test';
import { ApiUtils } from '../../utils/api-utils';

test.describe('API Test - ${method} ${endpoint}', () => {
  test('should ${method.toLowerCase()} ${endpoint}', async ({ request }) => {
    const apiClient = ApiUtils.createApiClient(request);
    
    const response = await apiClient.${method.toLowerCase()}('${endpoint}', ${JSON.stringify(testData, null, 2)});
    
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
  });
});`;
  }
} 
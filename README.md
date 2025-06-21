# Playwright Automation Framework

A robust, scalable, and maintainable Playwright automation framework built with TypeScript, featuring comprehensive logging, custom reporting, centralized configuration, and best practices for web automation testing.

## 🚀 Features

- **📁 Proper Folder Structure** - Well-organized project structure following best practices
- **📝 Comprehensive Logging** - Winston-based logging with multiple transports and colored output
- **📊 Custom Reports** - HTML, JSON, and Markdown reports with detailed test analytics
- **🎯 Centralized Locators** - Organized locator management with data-testid strategy
- **⚙️ Configuration Management** - YAML-based configuration with environment support
- **🏗️ Page Object Model** - Reusable page objects with base page class
- **🛠️ Test Utilities** - Helper functions for common test operations
- **🔌 API Testing Support** - Comprehensive API utilities for REST testing
- **📱 Multi-browser Support** - Chrome, Firefox, Safari, and mobile browsers
- **🔄 Retry Mechanisms** - Built-in retry logic with exponential backoff
- **📸 Visual Testing** - Screenshot and video capture on failures
- **🧪 Test Data Management** - Centralized test data with environment-specific values

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

## 🏗️ Project Structure

```
playwright-automation/
├── config/                     # Configuration files
│   ├── config.yaml            # YAML configuration
│   ├── properties.ts          # Configuration management
│   ├── global-setup.ts        # Global test setup
│   └── global-teardown.ts     # Global test teardown
├── locators/                   # Centralized locators
│   └── common-locators.ts     # Common element locators
├── pages/                      # Page Object Models
│   ├── base-page.ts           # Base page class
│   └── login-page.ts          # Example page object
├── tests/                      # Test files
│   └── login.spec.ts          # Example test suite
├── utils/                      # Utility classes
│   ├── logger.ts              # Logging utility
│   ├── test-utils.ts          # Test helper functions
│   ├── api-utils.ts           # API testing utilities
│   └── custom-reporter.ts     # Custom test reporter
├── reports/                    # Test reports (generated)
├── logs/                       # Log files (generated)
├── test-results/              # Test artifacts (generated)
├── playwright.config.ts       # Playwright configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── .eslintrc.js               # ESLint configuration
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## ⚙️ Configuration

### Environment Configuration

The framework supports multiple environments (dev, staging, production) through the `config/config.yaml` file:

```yaml
environments:
  dev:
    baseUrl: "https://dev.example.com"
    timeout: 30000
    retries: 2
    headless: false
  staging:
    baseUrl: "https://staging.example.com"
    timeout: 30000
    retries: 1
    headless: true
  production:
    baseUrl: "https://example.com"
    timeout: 30000
    retries: 0
    headless: true
```

### Environment Variables

Create a `.env` file based on `env.example`:

```bash
# Test Environment
TEST_ENV=dev

# Application URLs
BASE_URL=https://dev.example.com
API_BASE_URL=https://api.example.com

# Test User Credentials
TEST_USERNAME=testuser
TEST_PASSWORD=testpass
TEST_EMAIL=test@example.com

# Logging Configuration
LOG_LEVEL=info
```

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run tests in parallel
npm run test:parallel

# Show test report
npm run test:report

# Generate test code
npm run test:codegen
```

### Running Specific Tests

```bash
# Run specific test file
npx playwright test tests/login.spec.ts

# Run tests matching pattern
npx playwright test --grep "login"

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests with specific environment
TEST_ENV=staging npx playwright test
```

### CI/CD Integration

```bash
# Install browsers for CI
npx playwright install --with-deps

# Run tests in CI mode
CI=true npx playwright test
```

## 📝 Writing Tests

### Page Object Model

Create page objects by extending the base page:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { CommonLocators } from '../locators/common-locators';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator(CommonLocators.FORMS.USERNAME_INPUT);
  private readonly passwordInput = this.page.locator(CommonLocators.FORMS.PASSWORD_INPUT);
  private readonly loginButton = this.page.locator(CommonLocators.FORMS.SUBMIT_BUTTON);

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}
```

### Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { Properties } from '../config/properties';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let properties: Properties;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    properties = Properties.getInstance();
    await loginPage.navigateToLoginPage();
  });

  test('should login with valid credentials', async () => {
    const testData = properties.getTestData('validUser');
    await loginPage.login(testData.username, testData.password);
    await loginPage.assertLoggedIn();
  });
});
```

### API Testing

```typescript
import { test, expect } from '@playwright/test';
import { ApiUtils } from '../utils/api-utils';

test('should validate API endpoint', async ({ request }) => {
  const response = await ApiUtils.post(request, '/api/login', {
    username: 'testuser',
    password: 'testpass'
  });

  ApiUtils.validateStatus(response, 200);
  ApiUtils.validateField(response, 'token');
});
```

## 📊 Reports and Logging

### Logging

The framework uses Winston for comprehensive logging:

- **Console Output**: Colored, formatted logs
- **File Logs**: Combined, error, and test execution logs
- **Log Levels**: error, warn, info, debug

### Reports

Multiple report formats are generated:

- **HTML Report**: Interactive web report with test details
- **JSON Report**: Machine-readable test results
- **Markdown Report**: Documentation-friendly format
- **JUnit Report**: CI/CD integration format

Reports are saved in the `reports/` directory.

## 🎯 Best Practices

### Locator Strategy

Use data-testid attributes for reliable element selection:

```html
<button data-testid="submit-button">Submit</button>
<input data-testid="username-input" type="text" />
```

### Test Organization

- Group related tests using `test.describe()`
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated

### Error Handling

- Use explicit waits instead of hard delays
- Implement retry mechanisms for flaky tests
- Capture screenshots and videos on failures
- Log detailed error information

### Performance

- Run tests in parallel when possible
- Use headless mode in CI/CD
- Optimize test data and setup
- Clean up test artifacts

## 🔧 Customization

### Adding New Browsers

Update `playwright.config.ts`:

```typescript
projects: [
  {
    name: 'edge',
    use: { ...devices['Desktop Edge'] },
  },
  // Add more browsers...
]
```

### Custom Reporters

Extend the custom reporter or add new ones:

```typescript
reporter: [
  ['html'],
  ['json'],
  ['../utils/custom-reporter.ts'], // Custom reporter
]
```

### Environment-Specific Configurations

Add new environments in `config/config.yaml`:

```yaml
environments:
  qa:
    baseUrl: "https://qa.example.com"
    timeout: 30000
    retries: 1
```

## 🐛 Troubleshooting

### Common Issues

1. **Browser Installation**
   ```bash
   npx playwright install
   ```

2. **Permission Issues**
   ```bash
   chmod +x node_modules/.bin/playwright
   ```

3. **Port Conflicts**
   ```bash
   # Kill processes using port 9323
   lsof -ti:9323 | xargs kill -9
   ```

### Debug Mode

```bash
# Run in debug mode
npx playwright test --debug

# Show browser
npx playwright test --headed

# Generate code
npx playwright codegen https://example.com
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Winston Logging](https://github.com/winstonjs/winston)
- [Page Object Model](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

**Happy Testing! 🎉**
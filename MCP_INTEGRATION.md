# MCP (Model Context Protocol) Integration for Playwright Automation

## 🚀 What is MCP?

**MCP (Model Context Protocol)** is a standardized protocol that enables AI models to interact with external tools, data sources, and services. In your Playwright automation framework, MCP provides AI-powered capabilities that revolutionize how you write, maintain, and analyze tests.

## 🎯 What Your MCP Server Can Do

### 1. **AI-Powered Test Generation**
- **Auto-generate test cases** based on your existing patterns
- **Create data-driven tests** from your `config.yaml` test data
- **Generate API tests** using your existing `api-utils.ts`
- **Adapt to UI changes** automatically

### 2. **Intelligent Failure Analysis**
- **Analyze test failures** and provide root cause analysis
- **Suggest fixes** for common failure patterns
- **Auto-heal broken locators** when UI changes
- **Predict potential failures** based on recent changes

### 3. **Real-time Test Monitoring**
- **Monitor test execution** in real-time
- **Provide live insights** during test runs
- **Set up intelligent alerts** for test conditions
- **Track performance metrics** and trends

### 4. **Dynamic Data Management**
- **Generate test data** dynamically
- **Validate test data** automatically
- **Manage environment configurations** intelligently
- **Backup and restore** test data

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Playwright    │    │   MCP Server    │    │   AI Models     │
│     Tests       │◄──►│   (TypeScript)  │◄──►│   (Claude/GPT)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐            ┌─────▼─────┐            ┌────▼────┐
    │  MCP    │            │  Tools    │            │ External│
    │ Client  │            │ & Utils   │            │ Services│
    └─────────┘            └───────────┘            └─────────┘
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the MCP Server

```bash
# Start the MCP server
npm run mcp:start

# Or run in development mode with auto-restart
npm run mcp:dev
```

The server will start on:
- **WebSocket**: `ws://localhost:3001`
- **STDIO**: For direct integration

### 3. Use MCP in Your Tests

```typescript
import { MCPClient } from '../utils/mcp-client';

test('AI-powered test example', async ({ page }) => {
  // Connect to MCP server
  await MCPClient.connect();
  
  try {
    // Generate a test case using AI
    const generatedTest = await MCPClient.generateTestCase(
      'search for products and add to cart',
      'ui',
      'valid'
    );
    
    console.log('Generated test:', generatedTest);
    
    // Execute your test...
    await page.goto('https://example.com');
    
  } finally {
    // Disconnect from MCP server
    MCPClient.disconnect();
  }
});
```

## 🛠️ Available MCP Tools

### Test Generation Tools

#### `generate_test_case`
Generates test cases based on existing patterns.

```typescript
const testCase = await MCPClient.generateTestCase(
  'login with valid credentials',
  'ui',
  'valid'
);
```

#### `generate_api_tests`
Generates API tests based on endpoints and methods.

```typescript
const apiTest = await MCPClient.generateApiTests(
  '/api/users',
  'POST',
  { name: 'Test User', email: 'test@example.com' }
);
```

#### `auto_heal_locators`
Suggests alternative locators when elements are not found.

```typescript
const suggestions = await MCPClient.autoHealLocators(
  'test-file.spec.ts',
  '#broken-selector',
  'https://example.com'
);
```

### Analysis Tools

#### `analyze_test_failure`
Analyzes test failures and provides suggestions.

```typescript
const analysis = await MCPClient.analyzeFailure(
  'test-file.spec.ts',
  'timeout',
  'Element #button not found within 30 seconds'
);
```

#### `get_insights`
Provides real-time insights about test execution.

```typescript
const insights = await MCPClient.getInsights('automationexercise', '1h');
```

### Monitoring Tools

#### `monitor_test_execution`
Monitors test execution in real-time.

```typescript
// Start monitoring
await MCPClient.startMonitoring('test-file.spec.ts', {
  testName: 'Login Test',
  browser: 'chromium'
});

// Update monitoring
await MCPClient.updateMonitoring('test-file.spec.ts', 'login', {
  status: 'completed',
  details: 'Successfully logged in'
});

// Stop monitoring
await MCPClient.stopMonitoring('test-file.spec.ts');
```

### Data Management Tools

#### `manage_test_data`
Manages test data dynamically.

```typescript
// Generate new test data
const newData = await MCPClient.manageTestData(
  'generate',
  'user',
  { userType: 'new' }
);

// Validate test data
const validation = await MCPClient.manageTestData(
  'validate',
  'user',
  { email: 'test@example.com', password: 'password123' }
);
```

## 📊 Real-World Examples

### Example 1: AI-Powered Test Generation

```typescript
test('should use AI to generate and execute test', async ({ page }) => {
  await MCPClient.connect();
  
  // Generate test case for a new feature
  const testCase = await MCPClient.generateTestCase(
    'user registration with email verification',
    'ui',
    'new'
  );
  
  console.log('AI Generated Test:', testCase);
  
  // Execute the generated scenario
  await page.goto(props.getBaseUrl());
  // ... test implementation
});
```

### Example 2: Intelligent Failure Recovery

```typescript
test('should auto-heal on failure', async ({ page }) => {
  try {
    await page.click('#login-button');
  } catch (error) {
    // AI analyzes the failure
    const analysis = await MCPClient.analyzeFailure(
      'login.spec.ts',
      'element_not_found',
      error.message
    );
    
    // AI suggests alternative locators
    const suggestions = await MCPClient.autoHealLocators(
      'login.spec.ts',
      '#login-button',
      page.url()
    );
    
    // Use the suggested locator
    const alternativeLocator = suggestions.match(/page\.locator\('([^']+)'\)/)?.[1];
    if (alternativeLocator) {
      await page.click(alternativeLocator);
    }
  }
});
```

### Example 3: Real-time Monitoring

```typescript
test('should monitor execution in real-time', async ({ page }) => {
  await MCPClient.startMonitoring('monitoring-test.spec.ts');
  
  try {
    await MCPClient.updateMonitoring('monitoring-test.spec.ts', 'navigation', {
      status: 'started',
      details: 'Navigating to homepage'
    });
    
    await page.goto(props.getBaseUrl());
    
    await MCPClient.updateMonitoring('monitoring-test.spec.ts', 'navigation', {
      status: 'completed',
      details: 'Successfully loaded homepage'
    });
    
    // Continue with test...
    
  } finally {
    await MCPClient.stopMonitoring('monitoring-test.spec.ts');
  }
});
```

## 🔧 Configuration

### MCP Server Configuration

The MCP server can be configured in `mcp-server/config.ts`:

```typescript
export const mcpConfig = {
  server: {
    port: 3001,
    host: 'localhost'
  },
  tools: {
    enableTestGeneration: true,
    enableFailureAnalysis: true,
    enableMonitoring: true,
    enableDataManagement: true
  },
  ai: {
    model: 'claude-3-sonnet',
    maxTokens: 4000,
    temperature: 0.1
  }
};
```

### Environment Variables

```bash
# MCP Server Configuration
MCP_SERVER_PORT=3001
MCP_SERVER_HOST=localhost

# AI Model Configuration
MCP_AI_MODEL=claude-3-sonnet
MCP_AI_API_KEY=your-api-key

# Logging
MCP_LOG_LEVEL=info
```

## 📈 Benefits

### 1. **Reduced Test Maintenance**
- AI automatically updates tests when UI changes
- Intelligent failure analysis reduces debugging time
- Auto-healing locators prevent test flakiness

### 2. **Faster Test Development**
- Generate test cases from natural language descriptions
- AI suggests optimal test data and scenarios
- Automated test pattern recognition

### 3. **Better Test Quality**
- AI analyzes test coverage and suggests improvements
- Real-time monitoring catches issues early
- Predictive analytics prevent failures

### 4. **Intelligent Insights**
- Natural language test reports
- Performance trend analysis
- Failure pattern recognition

## 🚀 Advanced Features

### Custom MCP Tools

You can create custom MCP tools by extending the existing tools:

```typescript
// mcp-server/tools/custom-tool.ts
export class CustomTool {
  static async customAction(args: any) {
    // Your custom logic here
    return {
      content: [
        {
          type: 'text',
          text: 'Custom action completed'
        }
      ]
    };
  }
}
```

### Integration with CI/CD

```yaml
# .github/workflows/test.yml
name: Tests with MCP
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Start MCP Server
        run: npm run mcp:start &
      
      - name: Run tests
        run: npm test
```

## 🔍 Troubleshooting

### Common Issues

1. **MCP Server Connection Failed**
   ```bash
   # Check if server is running
   curl http://localhost:3001/health
   
   # Restart server
   npm run mcp:start
   ```

2. **Tool Call Timeout**
   ```typescript
   // Increase timeout in MCPClient
   const response = await MCPClient.callTool('tool_name', args, { timeout: 60000 });
   ```

3. **AI Model Errors**
   ```bash
   # Check API key
   echo $MCP_AI_API_KEY
   
   # Verify model access
   curl -H "Authorization: Bearer $MCP_AI_API_KEY" \
        https://api.anthropic.com/v1/models
   ```

## 📚 Next Steps

1. **Start with the examples** in `tests/mcp-integration-example.spec.ts`
2. **Customize the MCP tools** for your specific needs
3. **Integrate with your CI/CD pipeline**
4. **Add more AI capabilities** as needed

## 🤝 Contributing

To extend the MCP integration:

1. Add new tools in `mcp-server/tools/`
2. Update the server in `mcp-server/index.ts`
3. Add client methods in `utils/mcp-client.ts`
4. Create examples in `tests/`

## 📄 License

This MCP integration is part of your Playwright automation framework and follows the same license terms. 
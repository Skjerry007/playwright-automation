import { test, expect } from '@playwright/test';
import { MCPClient } from '../utils/mcp-client';
import { ApiUtils } from '../utils/api-utils';
import { Properties } from '../config/properties';

test.describe('MCP Enhanced API Testing', () => {
  let props: Properties;

  test.beforeAll(async () => {
    await MCPClient.connect();
    props = Properties.getInstance();
  });

  test.afterAll(async () => {
    MCPClient.disconnect();
  });

  test('should generate and execute API tests with AI', async ({ request }) => {
    console.log('🤖 Generating API tests with AI...');
    
    // Generate API test for user registration
    const registrationTest = await MCPClient.generateApiTests(
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
    
    console.log('📝 AI Generated Registration Test:');
    console.log(registrationTest);
    
    // Generate API test for user login
    const loginTest = await MCPClient.generateApiTests(
      '/api/login',
      'POST',
      {
        email: 'test@example.com',
        password: 'password123'
      }
    );
    
    console.log('📝 AI Generated Login Test:');
    console.log(loginTest);
    
    // Execute the generated tests
    console.log('🚀 Executing AI-generated API tests...');
    
    // Test user registration
    const registerResponse = await request.post(`${props.getBaseUrl()}/api/register`, {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    
    // Use AI to analyze the response
    const registerAnalysis = await MCPClient.analyzeFailure(
      'mcp-api-testing-enhanced.spec.ts',
      'api_response',
      `Registration API Response: ${registerResponse.status()} - ${await registerResponse.text()}`
    );
    
    console.log('🔍 AI Registration Response Analysis:', registerAnalysis);
    
    // Test user login
    const loginResponse = await request.post(`${props.getBaseUrl()}/api/login`, {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    
    const loginAnalysis = await MCPClient.analyzeFailure(
      'mcp-api-testing-enhanced.spec.ts',
      'api_response',
      `Login API Response: ${loginResponse.status()} - ${await loginResponse.text()}`
    );
    
    console.log('🔍 AI Login Response Analysis:', loginAnalysis);
  });

  test('should use AI to manage API test data', async ({ request }) => {
    console.log('🔄 Testing AI-powered API data management...');
    
    // Generate different types of API test data
    const dataTypes = ['user', 'product', 'order'];
    
    for (const dataType of dataTypes) {
      console.log(`📊 Generating ${dataType} API test data...`);
      
      const apiData = await MCPClient.manageTestData(
        'generate',
        dataType,
        { count: 2, format: 'api' }
      );
      
      console.log(`✅ Generated ${dataType} API data:`, apiData);
      
      // Validate the generated data
      const validation = await MCPClient.manageTestData(
        'validate',
        dataType,
        apiData
      );
      
      console.log(`🔍 Validation for ${dataType}:`, validation);
      
      // Use the data in API tests
      const endpoint = `/${dataType}s`;
      const method = 'POST';
      
      console.log(`🧪 Testing ${method} ${endpoint} with generated data...`);
      
      try {
        const response = await request.post(`${props.getBaseUrl()}${endpoint}`, {
          data: apiData
        });
        
        console.log(`✅ ${dataType} API test successful: ${response.status()}`);
        
        // Use AI to analyze the response
        const responseAnalysis = await MCPClient.analyzeFailure(
          'mcp-api-testing-enhanced.spec.ts',
          'api_response',
          `${dataType} API Response: ${response.status()} - ${await response.text()}`
        );
        
        console.log(`🔍 AI Response Analysis for ${dataType}:`, responseAnalysis);
        
      } catch (error) {
        console.log(`❌ ${dataType} API test failed:`, error);
        
        // Use AI to analyze the failure
        const errorAnalysis = await MCPClient.analyzeFailure(
          'mcp-api-testing-enhanced.spec.ts',
          'api_error',
          error instanceof Error ? error.message : 'Unknown API error'
        );
        
        console.log(`🔍 AI Error Analysis for ${dataType}:`, errorAnalysis);
      }
    }
  });

  test('should monitor API performance with AI insights', async ({ request }) => {
    console.log('📈 Testing API performance monitoring with AI...');
    
    // Start monitoring API performance
    await MCPClient.startMonitoring('mcp-api-testing-enhanced.spec.ts', {
      testName: 'API Performance Monitoring',
      type: 'api',
      endpoints: ['/api/users', '/api/products', '/api/orders']
    });
    
    try {
      const endpoints = [
        { path: '/api/users', method: 'GET', description: 'Get Users' },
        { path: '/api/products', method: 'GET', description: 'Get Products' },
        { path: '/api/orders', method: 'GET', description: 'Get Orders' }
      ];
      
      for (const endpoint of endpoints) {
        console.log(`🔍 Testing ${endpoint.description}...`);
        
        await MCPClient.updateMonitoring('mcp-api-testing-enhanced.spec.ts', 'api_call', {
          status: 'started',
          details: `Calling ${endpoint.method} ${endpoint.path}`,
          endpoint: endpoint.path,
          method: endpoint.method
        });
        
        const startTime = Date.now();
        
        try {
          const response = await request.get(`${props.getBaseUrl()}${endpoint.path}`);
          const responseTime = Date.now() - startTime;
          
          await MCPClient.updateMonitoring('mcp-api-testing-enhanced.spec.ts', 'api_call', {
            status: 'completed',
            details: `${endpoint.description} completed`,
            responseTime,
            statusCode: response.status(),
            endpoint: endpoint.path
          });
          
          console.log(`✅ ${endpoint.description}: ${response.status()} (${responseTime}ms)`);
          
          // Use AI to analyze performance
          if (responseTime > 2000) {
            const performanceAnalysis = await MCPClient.analyzeFailure(
              'mcp-api-testing-enhanced.spec.ts',
              'performance',
              `${endpoint.path} took ${responseTime}ms to respond`
            );
            
            console.log(`⚠️ Performance warning for ${endpoint.path}:`, performanceAnalysis);
          }
          
        } catch (error) {
          const errorTime = Date.now() - startTime;
          
          await MCPClient.updateMonitoring('mcp-api-testing-enhanced.spec.ts', 'api_call', {
            status: 'error',
            details: `${endpoint.description} failed`,
            responseTime: errorTime,
            error: error instanceof Error ? error.message : 'Unknown error',
            endpoint: endpoint.path
          });
          
          console.log(`❌ ${endpoint.description} failed:`, error);
        }
      }
      
      // Get AI insights about API performance
      const insights = await MCPClient.getInsights('api-testing', '1h');
      console.log('📊 API Performance Insights:', insights);
      
    } finally {
      await MCPClient.stopMonitoring('mcp-api-testing-enhanced.spec.ts');
    }
  });

  test('should auto-generate API test scenarios', async ({ request }) => {
    console.log('🤖 Testing AI-generated API test scenarios...');
    
    // Define API endpoints to test
    const apiEndpoints = [
      { path: '/api/users', method: 'GET', description: 'Get all users' },
      { path: '/api/users/1', method: 'GET', description: 'Get user by ID' },
      { path: '/api/products', method: 'GET', description: 'Get all products' },
      { path: '/api/products/1', method: 'GET', description: 'Get product by ID' }
    ];
    
    for (const endpoint of apiEndpoints) {
      console.log(`🧪 Testing scenario: ${endpoint.description}`);
      
      // Generate test data for this endpoint
      const testData = await MCPClient.manageTestData(
        'generate',
        'api_test',
        { endpoint: endpoint.path, method: endpoint.method }
      );
      
      console.log(`📊 Generated test data for ${endpoint.path}:`, testData);
      
      // Generate API test using AI
      const apiTest = await MCPClient.generateApiTests(
        endpoint.path,
        endpoint.method,
        testData
      );
      
      console.log(`📝 AI Generated Test for ${endpoint.path}:`);
      console.log(apiTest);
      
      // Execute the generated test
      try {
        let response;
        
        if (endpoint.method === 'GET') {
          response = await request.get(`${props.getBaseUrl()}${endpoint.path}`);
        } else if (endpoint.method === 'POST') {
          response = await request.post(`${props.getBaseUrl()}${endpoint.path}`, {
            data: testData
          });
        }
        
        if (response) {
          console.log(`✅ ${endpoint.description}: ${response.status()}`);
          
          // Use AI to validate the response
          const responseValidation = await MCPClient.analyzeFailure(
            'mcp-api-testing-enhanced.spec.ts',
            'api_validation',
            `${endpoint.path} response: ${response.status()} - ${await response.text()}`
          );
          
          console.log(`🔍 AI Response Validation:`, responseValidation);
        }
        
      } catch (error) {
        console.log(`❌ ${endpoint.description} failed:`, error);
        
        // Use AI to suggest fixes
        const fixSuggestions = await MCPClient.analyzeFailure(
          'mcp-api-testing-enhanced.spec.ts',
          'api_fix',
          error instanceof Error ? error.message : 'Unknown API error'
        );
        
        console.log(`🔧 AI Fix Suggestions:`, fixSuggestions);
      }
    }
  });
}); 
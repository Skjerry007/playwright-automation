import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WebSocketServerTransport } from '@modelcontextprotocol/sdk/server/websocket.js';
import { TestGenerationTool } from './tools/test-generation-tool.js';
import { TestAnalysisTool } from './tools/test-analysis-tool.js';
import { DataManagementTool } from './tools/data-management-tool.js';
import { TestMonitoringTool } from './tools/test-monitoring-tool.js';
import { Logger } from '../utils/logger.js';

class PlaywrightMCPServer {
  private server: Server;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('MCPServer');
    this.server = new Server(
      {
        name: 'playwright-automation-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.setupTools();
    this.setupResources();
    this.setupPrompts();
  }

  private setupTools() {
    // Register all MCP tools
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;
      
      this.logger.info(`Tool called: ${name}`, { args });
      
      switch (name) {
        case 'generate_test_case':
          return await TestGenerationTool.generateTestCase(args);
        case 'analyze_test_failure':
          return await TestAnalysisTool.analyzeFailure(args);
        case 'manage_test_data':
          return await DataManagementTool.manageData(args);
        case 'monitor_test_execution':
          return await TestMonitoringTool.monitorExecution(args);
        case 'auto_heal_locators':
          return await TestGenerationTool.autoHealLocators(args);
        case 'generate_api_tests':
          return await TestGenerationTool.generateApiTests(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private setupResources() {
    // Register resources that can be accessed
    this.server.setRequestHandler('resources/read', async (request) => {
      const { uri } = request.params;
      
      this.logger.info(`Resource requested: ${uri}`);
      
      switch (uri) {
        case 'test-results://latest':
          return await this.getLatestTestResults();
        case 'config://test-data':
          return await this.getTestData();
        case 'logs://execution':
          return await this.getExecutionLogs();
        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });
  }

  private setupPrompts() {
    // Register prompt templates
    this.server.setRequestHandler('prompts/list', async () => {
      return {
        prompts: [
          {
            name: 'generate_login_test',
            description: 'Generate a login test case based on existing patterns',
            arguments: {
              type: 'object',
              properties: {
                userType: { type: 'string', enum: ['valid', 'invalid', 'new'] },
                scenario: { type: 'string', description: 'Test scenario description' }
              }
            }
          },
          {
            name: 'analyze_failure_pattern',
            description: 'Analyze test failure patterns and suggest fixes',
            arguments: {
              type: 'object',
              properties: {
                testFile: { type: 'string', description: 'Path to test file' },
                failureType: { type: 'string', enum: ['timeout', 'assertion', 'element_not_found'] }
              }
            }
          }
        ]
      };
    });
  }

  private async getLatestTestResults() {
    // Implementation to read latest test results
    return {
      contents: [
        {
          uri: 'test-results://latest',
          mimeType: 'application/json',
          text: JSON.stringify({
            totalTests: 34,
            passed: 30,
            failed: 4,
            skipped: 0,
            executionTime: '2m 30s'
          })
        }
      ]
    };
  }

  private async getTestData() {
    // Implementation to read test data from config
    return {
      contents: [
        {
          uri: 'config://test-data',
          mimeType: 'application/json',
          text: JSON.stringify({
            validUser: { username: 'testuser@example.com', password: 'testpass123' },
            invalidUser: { username: 'invalid@example.com', password: 'wrongpass' }
          })
        }
      ]
    };
  }

  private async getExecutionLogs() {
    // Implementation to read execution logs
    return {
      contents: [
        {
          uri: 'logs://execution',
          mimeType: 'text/plain',
          text: 'Latest test execution logs...'
        }
      ]
    };
  }

  async start() {
    this.logger.info('Starting Playwright MCP Server...');
    
    // Start both stdio and WebSocket transports
    const stdioTransport = new StdioServerTransport();
    const wsTransport = new WebSocketServerTransport({
      port: 3001,
      host: 'localhost'
    });

    await this.server.connect(stdioTransport);
    await this.server.connect(wsTransport);
    
    this.logger.info('MCP Server started successfully');
    this.logger.info('WebSocket server running on ws://localhost:3001');
  }
}

// Start the server
const mcpServer = new PlaywrightMCPServer();
mcpServer.start().catch(console.error); 
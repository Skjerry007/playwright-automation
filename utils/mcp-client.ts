import { Logger } from './logger.js';
import WebSocket from 'ws';

export interface MCPToolCall {
  name: string;
  arguments: any;
}

export interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export class MCPClient {
  private static logger = new Logger('MCPClient');
  private static ws: WebSocket | null = null;
  private static isConnected = false;
  private static messageId = 0;

  /**
   * Initialize MCP client connection
   */
  static async connect(serverUrl: string = 'ws://localhost:3001') {
    return new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(serverUrl);
      
      this.ws.on('open', () => {
        this.isConnected = true;
        this.logger.info('Connected to MCP server');
        resolve();
      });
      
      this.ws.on('error', (error) => {
        this.logger.error('MCP connection error', error);
        reject(error);
      });
      
      this.ws.on('close', () => {
        this.isConnected = false;
        this.logger.info('Disconnected from MCP server');
      });
    });
  }

  /**
   * Disconnect from MCP server
   */
  static disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  /**
   * Call an MCP tool
   */
  static async callTool(toolName: string, arguments_: any): Promise<MCPResponse> {
    if (!this.isConnected || !this.ws) {
      throw new Error('MCP client not connected');
    }

    const message = {
      jsonrpc: '2.0',
      id: ++this.messageId,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: arguments_
      }
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Tool call timeout: ${toolName}`));
      }, 30000);

      const messageHandler = (data: any) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.id === message.id) {
            clearTimeout(timeout);
            this.ws?.removeListener('message', messageHandler);
            resolve(response.result);
          }
        } catch (error) {
          this.logger.error('Error parsing MCP response', error);
        }
      };

      this.ws?.on('message', messageHandler);
      this.ws?.send(JSON.stringify(message));
    });
  }

  /**
   * Generate a test case using AI
   */
  static async generateTestCase(scenario: string, testType: string = 'ui', userType: string = 'valid') {
    try {
      const response = await this.callTool('generate_test_case', {
        scenario,
        testType,
        userType
      });
      
      return response.content[0]?.text || 'Failed to generate test case';
    } catch (error) {
      this.logger.error('Error generating test case', error);
      throw error;
    }
  }

  /**
   * Analyze test failure and get suggestions
   */
  static async analyzeFailure(testFile: string, failureType: string, errorMessage: string) {
    try {
      const response = await this.callTool('analyze_test_failure', {
        testFile,
        failureType,
        errorMessage
      });
      
      return response.content[0]?.text || 'Failed to analyze failure';
    } catch (error) {
      this.logger.error('Error analyzing failure', error);
      throw error;
    }
  }

  /**
   * Auto-heal broken locators
   */
  static async autoHealLocators(testFile: string, brokenLocator: string, pageUrl: string) {
    try {
      const response = await this.callTool('auto_heal_locators', {
        testFile,
        brokenLocator,
        pageUrl
      });
      
      return response.content[0]?.text || 'Failed to auto-heal locators';
    } catch (error) {
      this.logger.error('Error auto-healing locators', error);
      throw error;
    }
  }

  /**
   * Start monitoring test execution
   */
  static async startMonitoring(testFile: string, data: any = {}) {
    try {
      const response = await this.callTool('monitor_test_execution', {
        testFile,
        action: 'start',
        data
      });
      
      return response.content[0]?.text || 'Failed to start monitoring';
    } catch (error) {
      this.logger.error('Error starting monitoring', error);
      throw error;
    }
  }

  /**
   * Update monitoring data
   */
  static async updateMonitoring(testFile: string, action: string, data: any) {
    try {
      const response = await this.callTool('monitor_test_execution', {
        testFile,
        action: 'update',
        data: { action, ...data }
      });
      
      return response.content[0]?.text || 'Failed to update monitoring';
    } catch (error) {
      this.logger.error('Error updating monitoring', error);
      throw error;
    }
  }

  /**
   * Stop monitoring test execution
   */
  static async stopMonitoring(testFile: string) {
    try {
      const response = await this.callTool('monitor_test_execution', {
        testFile,
        action: 'stop'
      });
      
      return response.content[0]?.text || 'Failed to stop monitoring';
    } catch (error) {
      this.logger.error('Error stopping monitoring', error);
      throw error;
    }
  }

  /**
   * Get real-time insights
   */
  static async getInsights(testSuite: string, timeRange: string = '1h') {
    try {
      const response = await this.callTool('get_insights', {
        testSuite,
        timeRange
      });
      
      return response.content[0]?.text || 'Failed to get insights';
    } catch (error) {
      this.logger.error('Error getting insights', error);
      throw error;
    }
  }

  /**
   * Generate API tests
   */
  static async generateApiTests(endpoint: string, method: string, testData: any) {
    try {
      const response = await this.callTool('generate_api_tests', {
        endpoint,
        method,
        testData
      });
      
      return response.content[0]?.text || 'Failed to generate API tests';
    } catch (error) {
      this.logger.error('Error generating API tests', error);
      throw error;
    }
  }

  /**
   * Manage test data
   */
  static async manageTestData(action: string, dataType: string, data: any) {
    try {
      const response = await this.callTool('manage_test_data', {
        action,
        dataType,
        data
      });
      
      return response.content[0]?.text || 'Failed to manage test data';
    } catch (error) {
      this.logger.error('Error managing test data', error);
      throw error;
    }
  }
}

// Playwright test fixture for MCP integration
export const mcpFixture = {
  async setup() {
    await MCPClient.connect();
  },
  
  async teardown() {
    MCPClient.disconnect();
  }
};

// Utility function to use MCP in tests
export async function withMCP<T>(testFunction: () => Promise<T>): Promise<T> {
  try {
    await MCPClient.connect();
    const result = await testFunction();
    return result;
  } finally {
    MCPClient.disconnect();
  }
} 
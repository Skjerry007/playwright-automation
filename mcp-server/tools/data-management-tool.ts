import { Logger } from '../../utils/logger.js';
import { Properties } from '../../config/properties.js';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

export class DataManagementTool {
  private static logger = new Logger('DataManagementTool');
  private static properties = Properties.getInstance();

  /**
   * Manage test data and configurations
   */
  static async manageData(args: any) {
    const { action, dataType, data } = args;
    
    this.logger.info(`Managing data: ${action} for ${dataType}`);
    
    switch (action) {
      case 'generate':
        return await this.generateTestData(dataType, data);
      case 'update':
        return await this.updateTestData(dataType, data);
      case 'validate':
        return await this.validateTestData(dataType, data);
      case 'backup':
        return await this.backupTestData(dataType);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Generate dynamic test data
   */
  static async generateDynamicData(args: any) {
    const { dataType, count = 1, constraints = {} } = args;
    
    this.logger.info(`Generating ${count} ${dataType} records`);
    
    const generatedData = await this.createDynamicData(dataType, count, constraints);
    
    return {
      content: [
        {
          type: 'text',
          text: `Generated ${dataType} data:\n\n${JSON.stringify(generatedData, null, 2)}`
        }
      ]
    };
  }

  /**
   * Manage environment configurations
   */
  static async manageEnvironment(args: any) {
    const { environment, action, config } = args;
    
    this.logger.info(`Managing environment: ${environment} - ${action}`);
    
    switch (action) {
      case 'create':
        return await this.createEnvironment(environment, config);
      case 'update':
        return await this.updateEnvironment(environment, config);
      case 'validate':
        return await this.validateEnvironment(environment);
      case 'switch':
        return await this.switchEnvironment(environment);
      default:
        throw new Error(`Unknown environment action: ${action}`);
    }
  }

  private static async generateTestData(dataType: string, data: any) {
    const configPath = path.join(process.cwd(), 'config', 'config.yaml');
    const config = yaml.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Generate data based on type
    let generatedData;
    switch (dataType) {
      case 'user':
        generatedData = this.generateUserData(data);
        break;
      case 'product':
        generatedData = this.generateProductData(data);
        break;
      case 'order':
        generatedData = this.generateOrderData(data);
        break;
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
    
    // Update config with new data
    config.testData[dataType] = generatedData;
    fs.writeFileSync(configPath, yaml.stringify(config, null, 2));
    
    return {
      content: [
        {
          type: 'text',
          text: `Generated ${dataType} test data:\n\n${JSON.stringify(generatedData, null, 2)}`
        }
      ]
    };
  }

  private static generateUserData(constraints: any) {
    const timestamp = Date.now();
    return {
      name: `Test User ${timestamp}`,
      email: `testuser${timestamp}@example.com`,
      password: `password${timestamp}`,
      firstName: 'Test',
      lastName: 'User',
      company: 'Test Company',
      address1: '123 Test Street',
      address2: 'Apt 4B',
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
      zipCode: '94102',
      mobileNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
    };
  }

  private static generateProductData(constraints: any) {
    const products = [
      { name: 'Blue Top', category: 'Women', brand: 'Polo', price: 'Rs. 500' },
      { name: 'Men Tshirt', category: 'Men', brand: 'H&M', price: 'Rs. 400' },
      { name: 'Sleeveless Dress', category: 'Women', brand: 'Madame', price: 'Rs. 1000' },
      { name: 'Stylish Dress', category: 'Women', brand: 'Madame', price: 'Rs. 1500' },
      { name: 'Cotton T-Shirt', category: 'Men', brand: 'H&M', price: 'Rs. 350' }
    ];
    
    return products[Math.floor(Math.random() * products.length)];
  }

  private static generateOrderData(constraints: any) {
    return {
      productId: Math.floor(Math.random() * 1000) + 1,
      quantity: Math.floor(Math.random() * 5) + 1,
      totalAmount: Math.floor(Math.random() * 1000) + 100,
      orderDate: new Date().toISOString(),
      status: 'pending'
    };
  }

  private static async updateTestData(dataType: string, data: any) {
    const configPath = path.join(process.cwd(), 'config', 'config.yaml');
    const config = yaml.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Update existing data
    config.testData[dataType] = { ...config.testData[dataType], ...data };
    fs.writeFileSync(configPath, yaml.stringify(config, null, 2));
    
    return {
      content: [
        {
          type: 'text',
          text: `Updated ${dataType} test data:\n\n${JSON.stringify(config.testData[dataType], null, 2)}`
        }
      ]
    };
  }

  private static async validateTestData(dataType: string, data: any) {
    const validationRules = this.getValidationRules(dataType);
    const validationResults = this.validateData(data, validationRules);
    
    return {
      content: [
        {
          type: 'text',
          text: `Validation results for ${dataType}:\n\n${JSON.stringify(validationResults, null, 2)}`
        }
      ]
    };
  }

  private static getValidationRules(dataType: string) {
    const rules = {
      user: {
        email: { type: 'email', required: true },
        password: { type: 'string', minLength: 6, required: true },
        name: { type: 'string', required: true }
      },
      product: {
        name: { type: 'string', required: true },
        price: { type: 'string', pattern: /^Rs\. \d+$/, required: true }
      }
    };
    
    return rules[dataType] || {};
  }

  private static validateData(data: any, rules: any) {
    const results = { valid: true, errors: [] };
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];
      
      if (rule.required && !value) {
        results.errors.push(`${field} is required`);
        results.valid = false;
      }
      
      if (value && rule.type === 'email' && !this.isValidEmail(value)) {
        results.errors.push(`${field} must be a valid email`);
        results.valid = false;
      }
      
      if (value && rule.minLength && value.length < rule.minLength) {
        results.errors.push(`${field} must be at least ${rule.minLength} characters`);
        results.valid = false;
      }
      
      if (value && rule.pattern && !rule.pattern.test(value)) {
        results.errors.push(`${field} format is invalid`);
        results.valid = false;
      }
    }
    
    return results;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static async backupTestData(dataType: string) {
    const configPath = path.join(process.cwd(), 'config', 'config.yaml');
    const backupPath = path.join(process.cwd(), 'config', `backup-${dataType}-${Date.now()}.yaml`);
    
    const config = yaml.parse(fs.readFileSync(configPath, 'utf8'));
    const backupData = { [dataType]: config.testData[dataType] };
    
    fs.writeFileSync(backupPath, yaml.stringify(backupData, null, 2));
    
    return {
      content: [
        {
          type: 'text',
          text: `Backup created for ${dataType} at: ${backupPath}`
        }
      ]
    };
  }

  private static async createDynamicData(dataType: string, count: number, constraints: any) {
    const data = [];
    
    for (let i = 0; i < count; i++) {
      switch (dataType) {
        case 'user':
          data.push(this.generateUserData(constraints));
          break;
        case 'product':
          data.push(this.generateProductData(constraints));
          break;
        case 'order':
          data.push(this.generateOrderData(constraints));
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }
    }
    
    return data;
  }

  private static async createEnvironment(environment: string, config: any) {
    const configPath = path.join(process.cwd(), 'config', 'config.yaml');
    const yamlConfig = yaml.parse(fs.readFileSync(configPath, 'utf8'));
    
    yamlConfig.environments[environment] = {
      baseUrl: config.baseUrl || 'https://example.com',
      timeout: config.timeout || 30000,
      retries: config.retries || 2,
      headless: config.headless || false,
      slowMo: config.slowMo || 1000,
      viewport: config.viewport || { width: 1920, height: 1080 },
      userAgent: config.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };
    
    fs.writeFileSync(configPath, yaml.stringify(yamlConfig, null, 2));
    
    return {
      content: [
        {
          type: 'text',
          text: `Created environment: ${environment}\n\n${JSON.stringify(yamlConfig.environments[environment], null, 2)}`
        }
      ]
    };
  }

  private static async updateEnvironment(environment: string, config: any) {
    const configPath = path.join(process.cwd(), 'config', 'config.yaml');
    const yamlConfig = yaml.parse(fs.readFileSync(configPath, 'utf8'));
    
    if (!yamlConfig.environments[environment]) {
      throw new Error(`Environment ${environment} does not exist`);
    }
    
    yamlConfig.environments[environment] = { ...yamlConfig.environments[environment], ...config };
    fs.writeFileSync(configPath, yaml.stringify(yamlConfig, null, 2));
    
    return {
      content: [
        {
          type: 'text',
          text: `Updated environment: ${environment}\n\n${JSON.stringify(yamlConfig.environments[environment], null, 2)}`
        }
      ]
    };
  }

  private static async validateEnvironment(environment: string) {
    const configPath = path.join(process.cwd(), 'config', 'config.yaml');
    const yamlConfig = yaml.parse(fs.readFileSync(configPath, 'utf8'));
    
    if (!yamlConfig.environments[environment]) {
      return {
        content: [
          {
            type: 'text',
            text: `Environment ${environment} does not exist`
          }
        ]
      };
    }
    
    const envConfig = yamlConfig.environments[environment];
    const validation = this.validateEnvironmentConfig(envConfig);
    
    return {
      content: [
        {
          type: 'text',
          text: `Environment validation for ${environment}:\n\n${JSON.stringify(validation, null, 2)}`
        }
      ]
    };
  }

  private static validateEnvironmentConfig(config: any) {
    const results = { valid: true, errors: [], warnings: [] };
    
    if (!config.baseUrl) {
      results.errors.push('baseUrl is required');
      results.valid = false;
    }
    
    if (config.timeout && config.timeout < 1000) {
      results.warnings.push('timeout is very low, consider increasing');
    }
    
    if (config.retries && config.retries > 5) {
      results.warnings.push('high retry count may slow down test execution');
    }
    
    return results;
  }

  private static async switchEnvironment(environment: string) {
    // This would update the current environment setting
    process.env.TEST_ENV = environment;
    
    return {
      content: [
        {
          type: 'text',
          text: `Switched to environment: ${environment}`
        }
      ]
    };
  }
} 
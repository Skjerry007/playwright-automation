import dotenv from 'dotenv';
import yaml from 'yaml';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

export interface TestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
  slowMo: number;
  viewport: {
    width: number;
    height: number;
  };
  userAgent: string;
}

export interface EnvironmentConfig {
  dev: TestConfig;
  staging: TestConfig;
  production: TestConfig;
}

export class Properties {
  private static instance: Properties;
  private config: any;
  private environment: string;

  private constructor() {
    this.environment = process.env.TEST_ENV || 'dev';
    this.loadConfiguration();
  }

  public static getInstance(): Properties {
    if (!Properties.instance) {
      Properties.instance = new Properties();
    }
    return Properties.instance;
  }

  private loadConfiguration(): void {
    // Load YAML configuration
    const configPath = path.join(process.cwd(), 'config', 'config.yaml');
    if (fs.existsSync(configPath)) {
      const configFile = fs.readFileSync(configPath, 'utf8');
      this.config = yaml.parse(configFile);
    } else {
      // Fallback to default configuration
      this.config = this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): any {
    return {
      environments: {
        dev: {
          baseUrl: 'https://dev.example.com',
          timeout: 30000,
          retries: 2,
          headless: false,
          slowMo: 1000,
          viewport: {
            width: 1920,
            height: 1080
          },
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        staging: {
          baseUrl: 'https://staging.example.com',
          timeout: 30000,
          retries: 1,
          headless: true,
          slowMo: 500,
          viewport: {
            width: 1920,
            height: 1080
          },
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        production: {
          baseUrl: 'https://example.com',
          timeout: 30000,
          retries: 0,
          headless: true,
          slowMo: 0,
          viewport: {
            width: 1920,
            height: 1080
          },
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      testData: {
        validUser: {
          username: process.env.TEST_USERNAME || 'testuser',
          password: process.env.TEST_PASSWORD || 'testpass',
          email: process.env.TEST_EMAIL || 'test@example.com'
        },
        invalidUser: {
          username: 'invaliduser',
          password: 'invalidpass',
          email: 'invalid@example.com'
        }
      },
      api: {
        baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    };
  }

  public getEnvironmentConfig(): TestConfig {
    return this.config.environments[this.environment];
  }

  public getTestData(key: string): any {
    return this.config.testData[key];
  }

  public getApiConfig(): any {
    return this.config.api;
  }

  public getEnvironment(): string {
    return this.environment;
  }

  public getBaseUrl(): string {
    return this.getEnvironmentConfig().baseUrl;
  }

  public getTimeout(): number {
    return this.getEnvironmentConfig().timeout;
  }

  public getRetries(): number {
    return this.getEnvironmentConfig().retries;
  }

  public isHeadless(): boolean {
    return this.getEnvironmentConfig().headless;
  }

  public getSlowMo(): number {
    return this.getEnvironmentConfig().slowMo;
  }

  public getViewport(): { width: number; height: number } {
    return this.getEnvironmentConfig().viewport;
  }

  public getUserAgent(): string {
    return this.getEnvironmentConfig().userAgent;
  }
} 
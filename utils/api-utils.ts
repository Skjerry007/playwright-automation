import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from './logger';
import { Properties } from '../config/properties';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: T;
  url: string;
}

export class ApiUtils {
  private static logger = new Logger('ApiUtils');
  private static properties = Properties.getInstance();

  /**
   * Make a GET request
   */
  static async get<T = any>(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    this.logger.info(`GET ${url}`);
    
    const response = await this.makeRequest(
      () => request.get(url, { headers: options.headers }),
      options
    );
    
    return this.formatResponse<T>(response);
  }

  /**
   * Make a POST request
   */
  static async post<T = any>(
    request: APIRequestContext,
    url: string,
    data: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    this.logger.info(`POST ${url}`);
    
    const response = await this.makeRequest(
      () => request.post(url, { 
        data,
        headers: options.headers 
      }),
      options
    );
    
    return this.formatResponse<T>(response);
  }

  /**
   * Make a PUT request
   */
  static async put<T = any>(
    request: APIRequestContext,
    url: string,
    data: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    this.logger.info(`PUT ${url}`);
    
    const response = await this.makeRequest(
      () => request.put(url, { 
        data,
        headers: options.headers 
      }),
      options
    );
    
    return this.formatResponse<T>(response);
  }

  /**
   * Make a DELETE request
   */
  static async delete<T = any>(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    this.logger.info(`DELETE ${url}`);
    
    const response = await this.makeRequest(
      () => request.delete(url, { headers: options.headers }),
      options
    );
    
    return this.formatResponse<T>(response);
  }

  /**
   * Make a PATCH request
   */
  static async patch<T = any>(
    request: APIRequestContext,
    url: string,
    data: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    this.logger.info(`PATCH ${url}`);
    
    const response = await this.makeRequest(
      () => request.patch(url, { 
        data,
        headers: options.headers 
      }),
      options
    );
    
    return this.formatResponse<T>(response);
  }

  /**
   * Upload file
   */
  static async uploadFile<T = any>(
    request: APIRequestContext,
    url: string,
    filePath: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    this.logger.info(`UPLOAD ${url} - ${filePath}`);
    
    const response = await this.makeRequest(
      () => request.post(url, {
        multipart: {
          file: filePath
        },
        headers: options.headers
      }),
      options
    );
    
    return this.formatResponse<T>(response);
  }

  /**
   * Make request with retry logic
   */
  private static async makeRequest(
    requestFn: () => Promise<APIResponse>,
    options: ApiRequestOptions
  ): Promise<APIResponse> {
    const maxRetries = options.retries || this.properties.getApiConfig().retries || 3;
    const timeout = options.timeout || this.properties.getApiConfig().timeout || 10000;
    
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await requestFn();
        this.logger.info(`Response status: ${response.status()}`);
        return response;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          this.logger.error(`Request failed after ${maxRetries} attempts`, lastError);
          throw lastError;
        }
        
        this.logger.warn(`Attempt ${attempt + 1} failed, retrying...`);
        await this.sleep(1000 * Math.pow(2, attempt)); // Exponential backoff
      }
    }
    
    throw lastError!;
  }

  /**
   * Format API response
   */
  private static async formatResponse<T>(response: APIResponse): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {};
    const responseHeaders = response.headers();
    
    for (const [key, value] of Object.entries(responseHeaders)) {
      headers[key] = value;
    }

    let body: T;
    try {
      body = await response.json();
    } catch {
      body = await response.text() as T;
    }

    return {
      status: response.status(),
      statusText: response.statusText(),
      headers,
      body,
      url: response.url()
    };
  }

  /**
   * Validate response status
   */
  static validateStatus(response: ApiResponse, expectedStatus: number | number[]): void {
    const expectedStatuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    
    if (!expectedStatuses.includes(response.status)) {
      throw new Error(
        `Expected status ${expectedStatuses.join(' or ')}, but got ${response.status}. ` +
        `Response: ${JSON.stringify(response.body)}`
      );
    }
  }

  /**
   * Validate response body contains field
   */
  static validateField(response: ApiResponse, field: string): void {
    if (!response.body || typeof response.body !== 'object') {
      throw new Error(`Response body is not an object: ${JSON.stringify(response.body)}`);
    }
    
    if (!(field in response.body)) {
      throw new Error(`Field '${field}' not found in response: ${JSON.stringify(response.body)}`);
    }
  }

  /**
   * Validate response body field value
   */
  static validateFieldValue(response: ApiResponse, field: string, expectedValue: any): void {
    this.validateField(response, field);
    
    if (response.body[field] !== expectedValue) {
      throw new Error(
        `Field '${field}' expected to be '${expectedValue}', but got '${response.body[field]}'`
      );
    }
  }

  /**
   * Validate response body field type
   */
  static validateFieldType(response: ApiResponse, field: string, expectedType: string): void {
    this.validateField(response, field);
    
    const actualType = typeof response.body[field];
    if (actualType !== expectedType) {
      throw new Error(
        `Field '${field}' expected to be of type '${expectedType}', but got '${actualType}'`
      );
    }
  }

  /**
   * Generate authentication headers
   */
  static generateAuthHeaders(token: string): Record<string, string> {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Generate API key headers
   */
  static generateApiKeyHeaders(apiKey: string): Record<string, string> {
    return {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Sleep utility
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Log response details
   */
  static logResponse(response: ApiResponse): void {
    this.logger.info(`Response Details:`);
    this.logger.info(`  Status: ${response.status} ${response.statusText}`);
    this.logger.info(`  URL: ${response.url}`);
    this.logger.info(`  Headers: ${JSON.stringify(response.headers)}`);
    this.logger.info(`  Body: ${JSON.stringify(response.body, null, 2)}`);
  }

  /**
   * Create API client with default configuration
   */
  static createApiClient(request: APIRequestContext, baseUrl?: string) {
    const apiConfig = this.properties.getApiConfig();
    const defaultHeaders = apiConfig.headers || {};
    
    return {
      get: <T = any>(url: string, options: ApiRequestOptions = {}) =>
        this.get<T>(request, `${baseUrl || apiConfig.baseUrl}${url}`, {
          headers: { ...defaultHeaders, ...options.headers },
          ...options
        }),
      
      post: <T = any>(url: string, data: any, options: ApiRequestOptions = {}) =>
        this.post<T>(request, `${baseUrl || apiConfig.baseUrl}${url}`, data, {
          headers: { ...defaultHeaders, ...options.headers },
          ...options
        }),
      
      put: <T = any>(url: string, data: any, options: ApiRequestOptions = {}) =>
        this.put<T>(request, `${baseUrl || apiConfig.baseUrl}${url}`, data, {
          headers: { ...defaultHeaders, ...options.headers },
          ...options
        }),
      
      delete: <T = any>(url: string, options: ApiRequestOptions = {}) =>
        this.delete<T>(request, `${baseUrl || apiConfig.baseUrl}${url}`, {
          headers: { ...defaultHeaders, ...options.headers },
          ...options
        }),
      
      patch: <T = any>(url: string, data: any, options: ApiRequestOptions = {}) =>
        this.patch<T>(request, `${baseUrl || apiConfig.baseUrl}${url}`, data, {
          headers: { ...defaultHeaders, ...options.headers },
          ...options
        })
    };
  }
} 
// src/services/api.ts
import { getToken, getSettings } from '../utils/storage';

// Types and Interfaces
interface MockApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, any>;
}

interface MockApiHeaders {
  common: Record<string, string>;
  [key: string]: any;
}

interface MockApiDefaults {
  headers: MockApiHeaders;
}

interface MockApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: MockApiConfig;
}

interface MockApi {
  defaults: MockApiDefaults;
  get: <T = any>(url: string, config?: MockApiConfig) => Promise<MockApiResponse<T>>;
  post: <T = any>(url: string, data?: any, config?: MockApiConfig) => Promise<MockApiResponse<T>>;
  put: <T = any>(url: string, data?: any, config?: MockApiConfig) => Promise<MockApiResponse<T>>;
  delete: <T = any>(url: string, config?: MockApiConfig) => Promise<MockApiResponse<T>>;
  create: (config: MockApiConfig) => MockApi;
  mockEndpoint: <T = any>(url: string, method?: string, response?: T) => Promise<MockApiResponse<T>>;
  mockError: (url: string, method?: string, errorStatus?: number, errorMessage?: string) => Promise<never>;
}

// Constants
const BASE_API_URL = 'https://api.example.com';
const MOCK_DELAY = 500;

// Helper Functions
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const mockResponse = <T>(
  url: string,
  method: string,
  config: MockApiConfig = {},
  data: T | null = null
): Promise<MockApiResponse<T>> => {
  console.log(`Mock ${method} request to ${url}`, { config, data });

  return Promise.resolve({
    data: {
      success: true,
      message: 'Mock API response',
      data: data || {},
    } as T,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  });
};

// Mock API Implementation
export const api: MockApi = {
  defaults: {
    headers: {
      common: {},
    },
  },

  get: async <T>(url: string, config: MockApiConfig = {}) => {
    await delay(MOCK_DELAY);
    return mockResponse<T>(url, 'GET', config);
  },

  post: async <T>(url: string, data?: any, config: MockApiConfig = {}) => {
    await delay(MOCK_DELAY);
    return mockResponse<T>(url, 'POST', config, data);
  },

  put: async <T>(url: string, data?: any, config: MockApiConfig = {}) => {
    await delay(MOCK_DELAY);
    return mockResponse<T>(url, 'PUT', config, data);
  },

  delete: async <T>(url: string, config: MockApiConfig = {}) => {
    await delay(MOCK_DELAY);
    return mockResponse<T>(url, 'DELETE', config);
  },

  create: (config: MockApiConfig): MockApi => {
    console.log('Mock API created with config:', config);
    return api;
  },

  mockEndpoint: <T>(url: string, method = 'GET', response: T = {} as T): Promise<MockApiResponse<T>> => {
    return Promise.resolve({
      data: response,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
  },

  mockError: (
    url: string,
    method = 'GET',
    errorStatus = 400,
    errorMessage = 'Mock error'
  ): Promise<never> => {
    return Promise.reject({
      response: {
        data: {
          success: false,
          message: errorMessage,
        },
        status: errorStatus,
      },
    });
  },
};

// Token Management
export function setToken(token: string): void {
  if (token && token !== '') {
    api.defaults.headers.common.Authorization = 'Bearer ' + token;
    console.log('Mock API token set:', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    console.log('Mock API token cleared');
  }
  api.defaults.headers.common.os = 'iphone';
}

// Language Management
export function setlanguage(language: string): void {
  api.defaults.headers['Accept-Language'] = language;
  console.log('Mock API language set:', language);
}

// Initialize Settings
getSettings().then((settings) => {
  if (!settings) {
    setlanguage('en');
  } else {
    if (settings.language) {
      setlanguage('ar');
    } else {
      setlanguage('en');
    }
  }
});

// Initialize Token
getToken().then((token) => {
  setToken(token);
});
export interface EnvironmentConfig {
  APP_ENV: 'development' | 'staging' | 'production' | 'test';
  API_BASE_URL: string;
  AUTH_API_BASE_URL: string;
  APP_SCHEME: string;
}

export const ENV: EnvironmentConfig = {
  APP_ENV: (process.env.APP_ENV as EnvironmentConfig['APP_ENV']) || 'development',
  API_BASE_URL: process.env.API_BASE_URL || 'https://www.thesportsdb.com/api/v1/json/123',
  AUTH_API_BASE_URL: process.env.AUTH_API_BASE_URL || 'https://dummyjson.com',
  APP_SCHEME: process.env.APP_SCHEME || 'scoreline',
};

export default ENV;

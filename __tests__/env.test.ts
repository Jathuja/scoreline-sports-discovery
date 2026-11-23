import { ENV } from '../src/config/env';

describe('Environment Configuration', () => {
  it('should define essential configuration constants', () => {
    expect(ENV.APP_ENV).toBeDefined();
    expect(ENV.API_BASE_URL).toBeDefined();
    expect(ENV.AUTH_API_BASE_URL).toBeDefined();
    expect(ENV.APP_SCHEME).toBeDefined();
  });

  it('should default to TheSportsDB free tier API endpoint', () => {
    expect(ENV.API_BASE_URL).toContain('thesportsdb.com');
  });

  it('should default to DummyJSON authentication endpoint', () => {
    expect(ENV.AUTH_API_BASE_URL).toContain('dummyjson.com');
  });

  it('should default to scoreline deep link URL scheme', () => {
    expect(ENV.APP_SCHEME).toBe('scoreline');
  });
});

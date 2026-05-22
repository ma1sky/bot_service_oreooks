import { describe, it, expect, beforeEach } from '@jest/globals';
import { z } from 'zod';

// We need to test BaseService, but it's abstract so we'll create a concrete implementation
import BaseService from '../base.service';

// Create a concrete implementation for testing
class TestService extends BaseService {
  constructor(base: string) {
    super(base);
  }

  async testRequest<T>(res: Response, schema: z.ZodType<T>): Promise<T> {
    return this.request(res, schema);
  }
}

describe('BaseService', () => {
  let testService: TestService;

  beforeEach(() => {
    testService = new TestService('test-api.example.com');
  });

  describe('constructor', () => {
    it('should prepend https:// to base URL without protocol', () => {
      const service = new TestService('api.example.com');
      expect(service['base']).toBe('https://api.example.com');
    });

    it('should not prepend https:// to base URL that already has http://', () => {
      const service = new TestService('http://localhost:3000');
      expect(service['base']).toBe('http://localhost:3000');
    });

    it('should not prepend https:// to base URL that already has https://', () => {
      const service = new TestService('https://api.example.com');
      expect(service['base']).toBe('https://api.example.com');
    });

    it('should set Content-Type header', () => {
      expect(testService['headers']).toEqual({
        'Content-Type': 'application/json',
      });
    });
  });

  describe('request', () => {
    const testSchema = z.object({
      id: z.number(),
      name: z.string(),
    });

    it('should return parsed data when response is ok and JSON', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: () => Promise.resolve({ id: 1, name: 'Test' }),
        text: () => Promise.resolve('{"id":1,"name":"Test"}'),
      } as unknown as Response;

      const result = await testService.testRequest(mockResponse, testSchema);
      expect(result).toEqual({ id: 1, name: 'Test' });
    });

    it('should throw error when response is not ok', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        headers: {
          get: () => 'application/json',
        },
        text: () => Promise.resolve('Not found'),
      } as unknown as Response;

      await expect(
        testService.testRequest(mockResponse, testSchema)
      ).rejects.toThrow('API error 404: Not found');
    });

    it('should throw error when response is not JSON', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: () => 'text/plain',
        },
        text: () => Promise.resolve('Not JSON'),
      } as unknown as Response;

      await expect(
        testService.testRequest(mockResponse, testSchema)
      ).rejects.toThrow('Expected JSON but got text/plain');
    });

    it('should throw error when JSON parsing fails', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: () => Promise.reject(new Error('JSON parse error')),
        text: () => Promise.resolve('invalid json'),
      } as unknown as Response;

      await expect(
        testService.testRequest(mockResponse, testSchema)
      ).rejects.toThrow('API response validation failed');
    });

    it('should throw error when schema validation fails', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: () => Promise.resolve({ id: 'not-a-number', name: 'Test' }),
        text: () => Promise.resolve('{"id":"not-a-number","name":"Test"}'),
      } as unknown as Response;

      await expect(
        testService.testRequest(mockResponse, testSchema)
      ).rejects.toThrow('API response validation failed');
    });
  });
});
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import authService from '../auth.service';
import { mockFetchResponse } from '../../__tests__/test-utils';
(global.fetch as jest.Mock) = jest.fn();
describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('authUser', () => {
    it('should successfully authenticate user and return token', async () => {
      const mockResponse = {
        success: true,
        token: 'test-token-123',
      };
      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse)
      );
      const result = await authService.authUser('testuser', 'password123', 123456789);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://apiserviceoreooks-production.up.railway.app/auth',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login: 'testuser',
            password: 'password123',
            tgId: 123456789,
          }),
        }
      );
      expect(result).toEqual(mockResponse);
    });
    it('should handle existing user response', async () => {
      const mockResponse = {
        success: true,
        message: 'Пользователь уже существует',
      };
      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse)
      );
      const result = await authService.authUser('existinguser', 'password123', 123456789);
      expect(result).toEqual(mockResponse);
    });
    it('should handle API error response', async () => {
      const mockResponse = {
        success: false,
        message: 'Invalid credentials',
      };
      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse, false, 401)
      );
      await expect(
        authService.authUser('wronguser', 'wrongpass', 123456789)
      ).rejects.toThrow('API error 401: {"success":false,"message":"Invalid credentials"}');
    });
    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error('Network error'))
      );
      await expect(
        authService.authUser('testuser', 'password123', 123456789)
      ).rejects.toThrow('Network error');
    });
    it('should handle non-JSON response', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          headers: {
            get: () => 'text/html',
          },
          text: () => Promise.resolve('<html>Not JSON</html>'),
        })
      );
      await expect(
        authService.authUser('testuser', 'password123', 123456789)
      ).rejects.toThrow('Expected JSON but got text/html');
    });
    it('should handle invalid response schema', async () => {
      const invalidResponse = {
        success: 'yes', 
        token: 123, 
      };
      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(invalidResponse)
      );
      await expect(
        authService.authUser('testuser', 'password123', 123456789)
      ).rejects.toThrow('API response validation failed');
    });
  });
});
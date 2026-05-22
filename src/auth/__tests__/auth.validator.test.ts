import { describe, it, expect } from '@jest/globals';
import authValidator from '../auth.validator';

describe('AuthValidator', () => {
  describe('validateLogin', () => {
    it('should validate correct login', () => {
      const result = authValidator.validateLogin('testuser');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('testuser');
      }
    });

    it('should reject empty login', () => {
      const result = authValidator.validateLogin('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Логин слишком короткий');
      }
    });

    it('should reject login that is too long', () => {
      const longLogin = 'a'.repeat(101);
      const result = authValidator.validateLogin(longLogin);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Логин слишком длинный');
      }
    });
  });

  describe('validatePassword', () => {
    it('should validate correct password', () => {
      const result = authValidator.validatePassword('password123');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('password123');
      }
    });

    it('should reject empty password', () => {
      const result = authValidator.validatePassword('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Пароль слишком короткий');
      }
    });

    it('should reject password that is too long', () => {
      const longPassword = 'a'.repeat(101);
      const result = authValidator.validatePassword(longPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Пароль слишком длинный');
      }
    });
  });

  describe('validateAuth', () => {
    it('should validate correct auth data', () => {
      const authData = {
        login: 'testuser',
        password: 'password123',
        tgId: 123456789,
      };
      const result = authValidator.validateAuth(authData);
      expect(result.success).toBe(true);
      if (result.success) {
        // The schema only validates login and password, tgId is not part of the schema
        expect(result.data.login).toBe(authData.login);
        expect(result.data.password).toBe(authData.password);
        // tgId is not included in the schema output
      }
    });

    it('should reject auth data with missing fields', () => {
      const invalidAuthData = {
        login: 'testuser',
        // missing password and tgId
      };
      const result = authValidator.validateAuth(invalidAuthData);
      expect(result.success).toBe(false);
    });

    it('should reject auth data with wrong types', () => {
      const invalidAuthData = {
        login: 123, // should be string
        password: 'password123',
      };
      const result = authValidator.validateAuth(invalidAuthData);
      expect(result.success).toBe(false);
    });
  });
});
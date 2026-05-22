import { describe, it, expect } from '@jest/globals';
import taskValidator from '../tasks.validator';

describe('TaskValidator', () => {
  describe('validateTitle', () => {
    it('should validate correct title', () => {
      const result = taskValidator.validateTitle('Test Task');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Test Task');
      }
    });

    it('should reject empty title', () => {
      const result = taskValidator.validateTitle('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Слишком короткое название');
      }
    });

    it('should reject title that is too long', () => {
      const longTitle = 'a'.repeat(256);
      const result = taskValidator.validateTitle(longTitle);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Слишком длинное название');
      }
    });
  });

  describe('validateDescription', () => {
    it('should validate correct description', () => {
      const result = taskValidator.validateDescription('Test Description');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Test Description');
      }
    });

    it('should reject empty description', () => {
      const result = taskValidator.validateDescription('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Слишком короткое описание');
      }
    });

    it('should reject description that is too long', () => {
      const longDescription = 'a'.repeat(1001);
      const result = taskValidator.validateDescription(longDescription);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Слишком длинное описание');
      }
    });
  });

  describe('validateDeadline', () => {
    it('should validate correct date string in DD.MM.YYYY format', () => {
      const result = taskValidator.validateDeadline('01.01.2025');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
      }
    });

    it('should validate ISO datetime string', () => {
      const result = taskValidator.validateDeadline('2025-01-01T10:30:00.000Z');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
      }
    });

    it('should reject invalid date string', () => {
      const result = taskValidator.validateDeadline('invalid-date');
      expect(result.success).toBe(false);
    });

    it('should reject empty string', () => {
      const result = taskValidator.validateDeadline('');
      expect(result.success).toBe(false);
    });
  });

  describe('validateTask', () => {
    it('should validate correct task data', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        deadline: '01.01.2025',
        state: 'draft' as const,
      };
      const result = taskValidator.validateTask(taskData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Test Task');
        expect(result.data.description).toBe('Test Description');
        expect(result.data.deadline).toBeInstanceOf(Date);
        expect(result.data.state).toBe('draft');
      }
    });

    it('should validate task with minimal required fields', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Desc', // description is required with min length 2
        state: 'draft' as const,
      };
      const result = taskValidator.validateTask(taskData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Test Task');
        expect(result.data.description).toBe('Desc');
        expect(result.data.state).toBe('draft');
      }
    });

    it('should reject task with missing title', () => {
      const invalidTaskData = {
        description: 'Test Description',
        state: 'draft' as const,
      };
      const result = taskValidator.validateTask(invalidTaskData);
      expect(result.success).toBe(false);
    });

    it('should reject task with invalid state', () => {
      const invalidTaskData = {
        title: 'Test Task',
        description: 'Test Description',
        state: 'invalid-state',
      };
      const result = taskValidator.validateTask(invalidTaskData);
      expect(result.success).toBe(false);
    });
  });
});
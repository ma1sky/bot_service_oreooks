import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import taskService from '../tasks.service';
import { mockFetchResponse } from '../../__tests__/test-utils';
import type { TaskDraft } from '../tasks.types';

(global.fetch as jest.Mock) = jest.fn();

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task with Date deadline', async () => {
      const mockResponse = {
        success: true,
        task: {
          id: 1,
          title: 'Test Task',
          description: 'Test Description',
          deadline: new Date('2025-01-01'),
          authorId: 123456789,
          state: 'draft',
        },
      };

      const taskDraft: TaskDraft = {
        title: 'Test Task',
        description: 'Test Description',
        deadline: new Date('2025-01-01'),
      };

      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse)
      );

      const result = await taskService.createTask(taskDraft, 123456789);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apiserviceoreooks-production.up.railway.app/users/123456789/tasks',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authorId: 123456789,
            title: 'Test Task',
            description: 'Test Description',
            deadline: '2025-01-01T00:00:00.000Z',
            state: 'draft',
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should create a task with string deadline', async () => {
      const mockResponse = {
        success: true,
        task: {
          id: 2,
          title: 'Another Task',
          description: 'Another Description',
          deadline: new Date('2025-02-01'),
          authorId: 123456789,
          state: 'draft',
        },
      };

      const taskDraft: TaskDraft = {
        title: 'Another Task',
        description: 'Another Description',
        deadline: '2025-02-01',
      };

      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse)
      );

      const result = await taskService.createTask(taskDraft, 123456789);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apiserviceoreooks-production.up.railway.app/users/123456789/tasks',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authorId: 123456789,
            title: 'Another Task',
            description: 'Another Description',
            deadline: '2025-02-01T00:00:00.000Z',
            state: 'draft',
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should create a task without deadline', async () => {
      const mockResponse = {
        success: true,
        task: {
          id: 3,
          title: 'No Deadline Task',
          description: 'No Deadline Description',
          deadline: null,
          authorId: 123456789,
          state: 'draft',
        },
      };

      const taskDraft: TaskDraft = {
        title: 'No Deadline Task',
        description: 'No Deadline Description',
        // deadline is undefined
      };

      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse)
      );

      const result = await taskService.createTask(taskDraft, 123456789);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apiserviceoreooks-production.up.railway.app/users/123456789/tasks',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authorId: 123456789,
            title: 'No Deadline Task',
            description: 'No Deadline Description',
            state: 'draft',
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle API error', async () => {
      const taskDraft: TaskDraft = {
        title: 'Test Task',
        description: 'Test Description',
        deadline: new Date('2025-01-01'),
      };

      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse({ success: false, reason: 'Validation error' }, false, 400)
      );

      await expect(
        taskService.createTask(taskDraft, 123456789)
      ).rejects.toThrow('API error 400');
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const mockResponse = {
        success: true,
        task: {
          id: 1,
          title: 'Updated Task',
          description: 'Updated Description',
          deadline: new Date('2025-01-02'),
          authorId: 123456789,
          state: 'completed',
        },
      };

      const taskDraft: TaskDraft = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        deadline: new Date('2025-01-02'),
        state: 'completed',
      };

      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse)
      );

      const result = await taskService.updateTask(taskDraft, 123456789);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apiserviceoreooks-production.up.railway.app/users/123456789/tasks/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Updated Task',
            description: 'Updated Description',
            deadline: '2025-01-02T00:00:00.000Z',
            state: 'completed',
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when task id is missing', async () => {
      const taskDraft: TaskDraft = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      await expect(
        taskService.updateTask(taskDraft, 123456789)
      ).rejects.toThrow('Task id is required for update');
    });
  });

  describe('getTasks', () => {
    it('should get tasks for user', async () => {
      const mockResponse = {
        success: true,
        tasks: [
          {
            id: 1,
            title: 'Task 1',
            description: 'Description 1',
            deadline: new Date('2025-01-01'),
            authorId: 123456789,
            state: 'draft',
          },
          {
            id: 2,
            title: 'Task 2',
            description: 'Description 2',
            deadline: new Date('2025-01-02'),
            authorId: 123456789,
            state: 'completed',
          },
        ],
      };

      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse)
      );

      const result = await taskService.getTasks(123456789);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apiserviceoreooks-production.up.railway.app/users/123456789/tasks',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty tasks response', async () => {
      const mockResponse = {
        success: true,
        tasks: [],
      };

      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse)
      );

      const result = await taskService.getTasks(123456789);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTask', () => {
    it('should get a specific task', async () => {
      const mockResponse = {
        success: true,
        task: {
          id: 1,
          title: 'Specific Task',
          description: 'Specific Description',
          deadline: new Date('2025-01-01'),
          authorId: 123456789,
          state: 'draft',
        },
      };

      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse)
      );

      const result = await taskService.getTask(123456789, 1);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apiserviceoreooks-production.up.railway.app/users/123456789/tasks/1',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const mockResponse = {
        success: true,
        task: {
          id: 1,
          title: 'Task to delete',
          description: 'Description',
          deadline: new Date('2025-01-01'),
          authorId: 123456789,
          state: 'draft',
        },
      };

      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse)
      );

      const result = await taskService.deleteTask(123456789, 1);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apiserviceoreooks-production.up.railway.app/users/123456789/tasks/1',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('toggleTaskState', () => {
    it('should toggle task state', async () => {
      const mockResponse = {
        success: true,
        task: {
          id: 1,
          title: 'Task',
          description: 'Description',
          deadline: new Date('2025-01-01'),
          authorId: 123456789,
          state: 'completed',
        },
      };

      (global.fetch as jest.Mock).mockImplementation(
        mockFetchResponse(mockResponse)
      );

      const result = await taskService.toggleTaskState(123456789, 1);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apiserviceoreooks-production.up.railway.app/users/123456789/tasks/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });
  });
});
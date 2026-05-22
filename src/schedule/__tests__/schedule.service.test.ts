import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import scheduleService from '../schedule.service';
import { mockFetchResponse } from '../../__tests__/test-utils';

// Mock the global fetch
(global.fetch as jest.Mock) = jest.fn();

describe('ScheduleService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getSchedule', () => {
		it('should get schedule for a specific date', async () => {
			const mockResponse = {
				success: true,
				schedule: {
					week: 1,
					weekType: 'числитель',
					dayOfWeek: 'Понедельник',
					date: new Date('2025-01-01'),
					lessons: [
						{
							lesson_name: 'Математика',
							lesson_type: 'Лекция',
							lesson_number: 1,
							start: new Date('2025-01-01T08:00:00.000Z'),
							end: new Date('2025-01-01T09:30:00.000Z'),
							teacher: 'Иванов И.И.',
							classroom: 'А-101',
						},
						{
							lesson_name: 'Физика',
							lesson_type: 'Практика',
							lesson_number: 2,
							start: new Date('2025-01-01T10:00:00.000Z'),
							end: new Date('2025-01-01T11:30:00.000Z'),
							teacher: 'Петров П.П.',
							classroom: 'Б-202',
						},
					],
				},
			};

			const testDate = new Date('2025-01-01');
			(global.fetch as jest.Mock).mockImplementation(mockFetchResponse(mockResponse));

			const result = await scheduleService.getSchedule(123456789, testDate);

			expect(global.fetch).toHaveBeenCalledWith(
				'https://apiserviceoreooks-production.up.railway.app/users/123456789/schedule/2025-01-01',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			expect(result).toEqual(mockResponse);
		});

		it('should handle schedule with no lessons', async () => {
			const mockResponse = {
				success: true,
				schedule: {
					week: 2,
					weekType: 'знаменатель',
					dayOfWeek: 'Воскресенье',
					date: new Date('2025-01-05'),
					lessons: [],
				},
			};

			const testDate = new Date('2025-01-05');
			(global.fetch as jest.Mock).mockImplementation(mockFetchResponse(mockResponse));

			const result = await scheduleService.getSchedule(123456789, testDate);

			expect(global.fetch).toHaveBeenCalledWith(
				'https://apiserviceoreooks-production.up.railway.app/users/123456789/schedule/2025-01-05',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			expect(result).toEqual(mockResponse);
		});

		it('should handle API error response', async () => {
			const testDate = new Date('2025-01-01');
			(global.fetch as jest.Mock).mockImplementation(
				mockFetchResponse({ success: false, reason: 'User not found' }, false, 404),
			);

			await expect(scheduleService.getSchedule(123456789, testDate)).rejects.toThrow(
				'API error 404',
			);
		});

		it('should handle network error', async () => {
			const testDate = new Date('2025-01-01');
			(global.fetch as jest.Mock).mockImplementation(() => {
				throw new Error('Network error');
			});

			await expect(scheduleService.getSchedule(123456789, testDate)).rejects.toThrow(
				'Network error',
			);
		});

		it('should handle invalid response schema', async () => {
			const testDate = new Date('2025-01-01');
			const invalidResponse = {
				success: true,
				schedule: {
					week: 'invalid', // should be number
					weekType: 'числитель',
					dayOfWeek: 'Понедельник',
					date: new Date('2025-01-01'),
					lessons: [],
				},
			};

			(global.fetch as jest.Mock).mockImplementation(mockFetchResponse(invalidResponse));

			await expect(scheduleService.getSchedule(123456789, testDate)).rejects.toThrow();
		});

		it('should format date correctly in URL', async () => {
			const mockResponse = {
				success: true,
				schedule: {
					week: 1,
					weekType: 'числитель',
					dayOfWeek: 'Понедельник',
					date: new Date('2025-12-31'),
					lessons: [],
				},
			};

			// Test with different date formats
			const testDate = new Date('2025-12-31T23:59:59.999Z');
			(global.fetch as jest.Mock).mockImplementation(mockFetchResponse(mockResponse));

			await scheduleService.getSchedule(123456789, testDate);

			// Should extract YYYY-MM-DD part
			expect(global.fetch).toHaveBeenCalledWith(
				'https://apiserviceoreooks-production.up.railway.app/users/123456789/schedule/2025-12-31',
				expect.any(Object),
			);
		});
	});
});

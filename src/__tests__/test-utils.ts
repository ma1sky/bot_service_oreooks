import { jest, describe, it, expect } from '@jest/globals';

export function mockFetchResponse<T>(data: T, ok = true, status = 200) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      status,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    })
  );
}
export function mockFetchError(errorMessage: string, status = 500) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: false,
      status,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve({ success: false, message: errorMessage }),
      text: () => Promise.resolve(errorMessage),
    })
  );
}
export function createMockContext(additionalProps = {}) {
  return {
    message: { text: 'test' },
    from: { id: 123456789, first_name: 'Test' },
    reply: jest.fn(),
    editMessageText: jest.fn(),
    deleteMessage: jest.fn(),
    answerCbQuery: jest.fn(),
    scene: {
      enter: jest.fn(),
      leave: jest.fn(),
    },
    session: {},
    ...additionalProps,
  };
}

export function resetMocks() {
  jest.clearAllMocks();
}
describe('test-utils', () => {
  it('should export utility functions', () => {
    expect(typeof mockFetchResponse).toBe('function');
    expect(typeof mockFetchError).toBe('function');
    expect(typeof createMockContext).toBe('function');
    expect(typeof resetMocks).toBe('function');
  });
});
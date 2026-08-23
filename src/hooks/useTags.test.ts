import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useTags } from './useTags';

const mockGet = vi.fn();

vi.mock('../services/api/client', () => ({
  default: { get: (...args: unknown[]) => mockGet(...args) },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => {
  mockGet.mockReset();
});

describe('useTags', () => {
  it('should call GET /tags', async () => {
    mockGet.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useTags(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGet).toHaveBeenCalledWith('/tags');
  });
});

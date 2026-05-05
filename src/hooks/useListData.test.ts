import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useListData } from './useListData';

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

describe('useListData', () => {
  it('should call apiClient.get with the correct URL', async () => {
    mockGet.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useListData('equipments'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGet).toHaveBeenCalledWith('/list/equipments');
  });

  it('should return data from the API', async () => {
    const equipment = [
      { id: '1', name: 'Dumbbells', type: 'free_weight' },
      { id: '2', name: 'Barbell', type: 'free_weight' },
    ];
    mockGet.mockResolvedValue({ data: equipment });

    const { result } = renderHook(() => useListData('equipments'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(equipment);
  });

  it('should use the correct query key', async () => {
    mockGet.mockResolvedValue({ data: [] });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(() => useListData('muscles'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const cached = queryClient.getQueryData(['list', 'muscles']);
    expect(cached).toEqual([]);
  });
});

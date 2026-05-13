import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';

const mockGet = vi.fn();

vi.mock('../services/api/client', () => ({
  default: { get: (...args: unknown[]) => mockGet(...args) },
}));

import { useMyPermissions } from './usePermissions';

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

describe('useMyPermissions', () => {
  it('should call /me/permissions and return permission data', async () => {
    const perms = [
      { resource: 'exercises', action: 'READ', allowed: true },
      { resource: 'exercises', action: 'DELETE', allowed: false },
    ];
    mockGet.mockResolvedValue({ data: { permissions: perms } });

    const { result } = renderHook(() => useMyPermissions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGet).toHaveBeenCalledWith('/me/permissions');
    expect(result.current.data).toEqual(perms);
  });
});

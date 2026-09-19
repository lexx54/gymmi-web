import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';

const mockGet = vi.fn();

vi.mock('../services/api/client', () => ({
  default: { get: (...args: unknown[]) => mockGet(...args) },
}));

import { useEntitlements, useMyPermissions } from './usePermissions';

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
    const response = {
      permissions: perms,
      hasPaid: false,
      plan: 'free',
      role: 'Trainer',
      entitlements: {
        limits: { templates: 2 },
        usage: { templates: 1 },
        capabilities: { canCreateTemplate: true },
      },
    };
    mockGet.mockResolvedValue({ data: response });

    const { result } = renderHook(() => useMyPermissions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGet).toHaveBeenCalledWith('/me/permissions');
    expect(result.current.data).toEqual(response);
  });

  it('exposes optional entitlement snapshot data', async () => {
    mockGet.mockResolvedValue({
      data: {
        permissions: [],
        plan: 'plus',
        entitlements: { isCoveredClient: true, downgradeEffectiveAt: null },
      },
    });

    const { result } = renderHook(() => useEntitlements(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.plan).toBe('plus');
    expect(result.current.data?.isCoveredClient).toBe(true);
  });
});

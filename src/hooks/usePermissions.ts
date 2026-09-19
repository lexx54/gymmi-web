import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchMyPermissions } from '../services/api/permissions';
import type {
  EntitlementCapabilities,
  EntitlementResource,
  MyPermissionsResponse,
} from '../types/rbac';

export const myPermissionsQueryKey = ['me', 'permissions'] as const;

export function useMyPermissions() {
  return useQuery<MyPermissionsResponse>({
    queryKey: myPermissionsQueryKey,
    queryFn: fetchMyPermissions,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useHasPermission(resource: string, action: string): boolean {
  const { data } = useMyPermissions();
  return useMemo(
    () =>
      data?.permissions.some(
        (p) => p.resource === resource && p.action === action && p.allowed,
      ) ?? false,
    [data, resource, action],
  );
}

/** Exposes the optional entitlement snapshot from the shared permissions query. */
export function useEntitlements() {
  const query = useMyPermissions();
  return {
    ...query,
    data: query.data?.entitlements ?? undefined,
    plan: query.data?.plan ?? (query.data?.hasPaid === true ? 'plus' : query.data?.hasPaid === false ? 'free' : undefined),
    role: query.data?.role,
  };
}

/** Reads one optional capability while allowing mixed-version rollout. */
export function hasEntitlementCapability(
  capabilities: EntitlementCapabilities | undefined,
  capability: keyof EntitlementCapabilities,
  fallback = true,
): boolean {
  return capabilities?.[capability] ?? fallback;
}

/** Reads the first capability alias supplied by the API. */
export function hasAnyEntitlementCapability(
  capabilities: EntitlementCapabilities | undefined,
  capabilitiesToCheck: Array<keyof EntitlementCapabilities>,
  fallback = true,
): boolean {
  for (const capability of capabilitiesToCheck) {
    const value = capabilities?.[capability];
    if (typeof value === 'boolean') return value;
  }
  return fallback;
}

/** Checks a numeric quota only when both server values are present. */
export function isEntitlementLimitReached(
  limits: Partial<Record<EntitlementResource, number>> | undefined,
  usage: Partial<Record<EntitlementResource, number>> | undefined,
  resource: EntitlementResource,
): boolean {
  const limit = limits?.[resource];
  const used = usage?.[resource];
  return typeof limit === 'number' && typeof used === 'number' && used >= limit;
}

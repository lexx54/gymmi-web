import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchMyPermissions } from '../services/api/permissions';
import type { PermissionCell } from '../types/rbac';

export function useMyPermissions() {
  return useQuery<PermissionCell[]>({
    queryKey: ['me', 'permissions'],
    queryFn: fetchMyPermissions,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useHasPermission(resource: string, action: string): boolean {
  const { data } = useMyPermissions();
  return useMemo(
    () =>
      data?.some(
        (p) => p.resource === resource && p.action === action && p.allowed,
      ) ?? false,
    [data, resource, action],
  );
}

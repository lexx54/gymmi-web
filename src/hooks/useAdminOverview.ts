import { useQuery } from '@tanstack/react-query';
import { fetchAdminOverview } from '../services/api/admin';
import type { AdminOverview } from '../types/adminOverview';

/** Loads the platform summary shown on the Admin dashboard. */
export function useAdminOverview(enabled: boolean = true) {
  return useQuery<AdminOverview>({
    queryKey: ['admin', 'overview'],
    queryFn: fetchAdminOverview,
    enabled,
    refetchInterval: 60_000,
  });
}

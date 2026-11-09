import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchAdminAnalytics } from '../services/api/admin';
import type { AdminAnalytics, AnalyticsRange } from '../types/adminAnalytics';

/** Loads platform trends for the admin Analytics page; keeps the last range on screen while the next loads. */
export function useAdminAnalytics(range: AnalyticsRange, enabled: boolean = true) {
  return useQuery<AdminAnalytics>({
    queryKey: ['admin', 'analytics', range],
    queryFn: () => fetchAdminAnalytics(range),
    enabled,
    placeholderData: keepPreviousData,
  });
}

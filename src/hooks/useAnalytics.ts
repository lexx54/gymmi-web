import { useQuery } from '@tanstack/react-query';
import {
  fetchClientAnalytics,
  fetchMyAnalytics,
  type AnalyticsResponse,
} from '../services/api/analytics';

/**
 * Loads training analytics for the currently authenticated user.
 */
export function useMyAnalytics(enabled: boolean = true) {
  return useQuery<AnalyticsResponse>({
    queryKey: ['analytics', 'me'],
    queryFn: fetchMyAnalytics,
    enabled,
  });
}

/**
 * Loads training analytics for a specific client (Trainer/Admin).
 */
export function useClientAnalytics(clientId: string, enabled: boolean = true) {
  return useQuery<AnalyticsResponse>({
    queryKey: ['analytics', clientId],
    queryFn: () => fetchClientAnalytics(clientId),
    enabled: enabled && Boolean(clientId),
  });
}

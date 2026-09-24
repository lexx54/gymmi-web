import { useQuery } from '@tanstack/react-query';
import {
  fetchTrainerDashboard,
  type TrainerDashboardResponse,
} from '../services/api/dashboard';

/**
 * Loads dashboard metrics and weekly client activity for Trainers.
 */
export function useTrainerDashboard(enabled: boolean = true) {
  return useQuery<TrainerDashboardResponse>({
    queryKey: ['dashboard', 'trainer'],
    queryFn: fetchTrainerDashboard,
    enabled,
  });
}

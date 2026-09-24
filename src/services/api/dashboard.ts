import apiClient from './client';

export interface DailyClientActivity {
  weekday: number; // 0 = Mon, 1 = Tue, ..., 6 = Sun
  date: string;
  activeClients: number;
}

export interface TrainerClientActivity {
  totalClients: number;
  activeClientsThisWeek: number;
  activeRatePercent: number;
  daily: DailyClientActivity[];
}

export interface TrainerDashboardMetrics {
  totalClients: number;
  availableWorkouts: number;
}

export interface TrainerDashboardResponse {
  clientActivity: TrainerClientActivity;
  metrics: TrainerDashboardMetrics;
}

export async function fetchTrainerDashboard(): Promise<TrainerDashboardResponse> {
  const { data } = await apiClient.get<TrainerDashboardResponse>('/dashboard/trainer');
  return data;
}

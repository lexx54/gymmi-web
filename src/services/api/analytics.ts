import apiClient from './client';

export interface VolumeWeek {
  weekNumber: number;
  weekStartDate: string;
  volumeKg: number;
}

export interface PeakSession {
  date: string;
  volumeKg: number;
}

export interface DailyVolume {
  weekday: number;
  date: string;
  volumeKg: number;
}

export interface VolumeTrends {
  totalVolumeKg: number;
  deltaPercent: number;
  weeks: VolumeWeek[];
  dailyVolume: DailyVolume[];
  peakSession: PeakSession | null;
}

export interface MuscleSegment {
  id: string;
  labelKey: string;
  sets: number;
  percent: number;
  color: string;
}

export interface MuscleLoad {
  totalSets: number;
  distribution: MuscleSegment[];
}

export interface HeatmapCell {
  weekday: number;
  weekIndex: number;
  date: string;
  durationMinutes: number;
  intensityLevel: 0 | 1 | 2 | 3 | 4;
}

export interface ConsistencyHeatmap {
  streak: number;
  completionPercent: number;
  totalWorkouts: number;
  grid: HeatmapCell[][];
}

export type PersonalRecordStatus = 'ALL-TIME BEST' | 'NEW PR' | 'STEADY';

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  date: string;
  weightKg: number;
  reps: number;
  status: PersonalRecordStatus;
}

export interface AnalyticsResponse {
  volumeTrends: VolumeTrends;
  muscleLoad: MuscleLoad;
  consistency: ConsistencyHeatmap;
  personalRecords: PersonalRecord[];
}

export async function fetchMyAnalytics(): Promise<AnalyticsResponse> {
  const { data } = await apiClient.get<AnalyticsResponse>('/analytics/me');
  return data;
}

export async function fetchClientAnalytics(clientId: string): Promise<AnalyticsResponse> {
  const { data } = await apiClient.get<AnalyticsResponse>(`/analytics/client/${clientId}`);
  return data;
}

import apiClient from './client';
import type { ClassificationsData } from '../../types/classifications';

export interface FetchClassificationsParams {
  cohortType: 'gym' | 'trainer';
  cohortId: string;
  timeframe?: 'weekly' | 'monthly' | 'all-time';
  exerciseId?: string;
}

export async function fetchClassifications(
  params: FetchClassificationsParams,
): Promise<ClassificationsData> {
  const { data } = await apiClient.get<ClassificationsData>('/classifications', {
    params,
  });
  return data;
}

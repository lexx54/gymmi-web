import apiClient from './client';
import type { FullUserProfile, UpdateProfilePayload } from '../../types/auth';

export async function fetchUserProfileApi(): Promise<FullUserProfile> {
  const { data } = await apiClient.get<FullUserProfile>('/user/profile');
  return data;
}

export async function updateUserProfileApi(
  payload: UpdateProfilePayload,
): Promise<FullUserProfile> {
  const { data } = await apiClient.patch<FullUserProfile>('/user/profile', payload);
  return data;
}

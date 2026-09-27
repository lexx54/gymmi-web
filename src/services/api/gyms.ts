import apiClient from './client';
import type {
  GymProfile,
  GymMember,
  GymCoach,
  GymDashboardData,
  PublicGymItem,
} from '../../types/gym';
import type { GymProfileParams } from '../../types/auth';

export async function fetchPublicGyms(params?: {
  search?: string;
  city?: string;
}): Promise<PublicGymItem[]> {
  const { data } = await apiClient.get<PublicGymItem[]>('/gyms', { params });
  return data;
}

export async function fetchPublicGym(id: string): Promise<PublicGymItem> {
  const { data } = await apiClient.get<PublicGymItem>(`/gyms/${id}`);
  return data;
}

export async function fetchMyGym(): Promise<GymDashboardData> {
  const { data } = await apiClient.get<GymDashboardData>('/gyms/me');
  return data;
}

export async function updateMyGym(payload: Partial<GymProfileParams>): Promise<GymProfile> {
  const { data } = await apiClient.patch<GymProfile>('/gyms/me', payload);
  return data;
}

export async function fetchMyGymMembers(): Promise<GymMember[]> {
  const { data } = await apiClient.get<GymMember[]>('/gyms/me/members');
  return data;
}

export async function removeGymMember(memberId: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/gyms/me/members/${memberId}`);
  return data;
}

export async function fetchMyGymCoaches(): Promise<GymCoach[]> {
  const { data } = await apiClient.get<GymCoach[]>('/gyms/me/coaches');
  return data;
}

export async function approveGymCoach(coachId: string): Promise<GymCoach> {
  const { data } = await apiClient.post<GymCoach>(`/gyms/me/coaches/${coachId}/approve`);
  return data;
}

export async function rejectGymCoach(coachId: string): Promise<GymCoach> {
  const { data } = await apiClient.post<GymCoach>(`/gyms/me/coaches/${coachId}/reject`);
  return data;
}

export async function updateCoachPermissions(
  coachId: string,
  canPublishRoutines: boolean,
): Promise<GymCoach> {
  const { data } = await apiClient.patch<GymCoach>(`/gyms/me/coaches/${coachId}/permissions`, {
    canPublishRoutines,
  });
  return data;
}

export async function removeGymCoach(coachId: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/gyms/me/coaches/${coachId}`);
  return data;
}

export async function upgradeGymTier(tier: string): Promise<GymProfile> {
  const { data } = await apiClient.post<GymProfile>('/gyms/me/upgrade', { tier });
  return data;
}

export async function joinGym(gymId: string): Promise<GymMember> {
  const { data } = await apiClient.post<GymMember>(`/gyms/${gymId}/join`);
  return data;
}

export async function leaveGym(gymId: string): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(`/gyms/${gymId}/leave`);
  return data;
}

export async function fetchMyMemberships(): Promise<GymMember[]> {
  const { data } = await apiClient.get<GymMember[]>('/gyms/me/memberships');
  return data;
}

export async function requestAffiliation(gymId: string): Promise<GymCoach> {
  const { data } = await apiClient.post<GymCoach>(`/gyms/${gymId}/affiliate`);
  return data;
}

export async function fetchMyAffiliations(): Promise<GymCoach[]> {
  const { data } = await apiClient.get<GymCoach[]>('/gyms/me/affiliations');
  return data;
}

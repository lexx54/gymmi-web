import apiClient from './client';
import type { MyPermissionsResponse } from '../../types/rbac';

export async function fetchMyPermissions(): Promise<MyPermissionsResponse> {
  const { data } = await apiClient.get<MyPermissionsResponse>('/me/permissions');
  return data;
}

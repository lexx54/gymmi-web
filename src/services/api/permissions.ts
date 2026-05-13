import apiClient from './client';
import type { PermissionCell } from '../../types/rbac';

export async function fetchMyPermissions(): Promise<PermissionCell[]> {
  const { data } = await apiClient.get<{ permissions: PermissionCell[] }>('/me/permissions');
  return data.permissions;
}

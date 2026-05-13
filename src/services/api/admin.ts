import apiClient from './client';
import type { PermissionCell, RoleDto, PaginatedUsers } from '../../types/rbac';

export async function fetchRoles(): Promise<RoleDto[]> {
  const { data } = await apiClient.get<RoleDto[]>('/admin/roles');
  return data;
}

export async function fetchRolePermissions(roleId: string): Promise<PermissionCell[]> {
  const { data } = await apiClient.get<PermissionCell[]>(
    `/admin/roles/${roleId}/permissions`,
  );
  return data;
}

export async function updateRolePermissions(
  roleId: string,
  permissions: PermissionCell[],
): Promise<PermissionCell[]> {
  const { data } = await apiClient.put<PermissionCell[]>(
    `/admin/roles/${roleId}/permissions`,
    { permissions },
  );
  return data;
}

export async function fetchAdminUsers(
  page = 1,
  limit = 20,
  roleId?: string,
): Promise<PaginatedUsers> {
  const params: Record<string, string | number> = { page, limit };
  if (roleId) params.roleId = roleId;
  const { data } = await apiClient.get<PaginatedUsers>('/admin/users', { params });
  return data;
}

export async function patchAdminUser(
  userId: string,
  body: { roleId?: string; isActive?: boolean },
): Promise<unknown> {
  const { data } = await apiClient.patch(`/admin/users/${userId}`, body);
  return data;
}

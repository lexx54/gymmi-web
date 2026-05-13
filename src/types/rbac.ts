export type RoleName = 'Admin' | 'Gym' | 'Trainer' | 'Client';

export type PermissionAction = 'READ' | 'CREATE' | 'EDIT' | 'DELETE';

export type PermissionResource = 'exercises' | 'workouts' | 'list' | 'users' | 'roles';

export type PermissionCell = {
  resource: string;
  action: string;
  allowed: boolean;
};

export type RoleDto = {
  id: string;
  name: RoleName;
  isSystem: boolean;
  createdAt: string;
};

export type PaginatedUsers = {
  items: AdminUserDto[];
  total: number;
  page: number;
  limit: number;
};

export type AdminUserDto = {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  roleId: string;
  role: { id: string; name: string };
  createdAt: string;
};

import type { GymTier } from './gym';

export type RoleName = 'Admin' | 'Gym' | 'Trainer' | 'Client';

export type PermissionAction = 'READ' | 'CREATE' | 'EDIT' | 'DELETE';

export type PermissionResource = 'exercises' | 'workouts' | 'list' | 'users' | 'roles';

export type PermissionCell = {
  resource: string;
  action: string;
  allowed: boolean;
};

export type PlanName = 'free' | 'plus' | 'pro';
export type PaidPlan = Exclude<PlanName, 'free'>;

export type EntitlementResource =
  | 'templates'
  | 'trainerSeats'
  | 'customExercises'
  | 'sharing'
  | 'pdfExport'
  | 'branding';

export type EntitlementCapabilities = {
  canCreateTemplate?: boolean;
  canEditTemplate?: boolean;
  canEditOwnedTemplate?: boolean;
  canEditAssignmentFork?: boolean;
  canShare?: boolean;
  canAssign?: boolean;
  canSelfBuild?: boolean;
  canSelfAssign?: boolean;
  canCreateCustomExercise?: boolean;
  canCreateCustomExercises?: boolean;
  /** Coach Pro, Athlete Pro, Gym Pro and Gym Maximum. */
  canExportPdf?: boolean;
  /** Coach Pro and Gym Maximum. */
  canBrand?: boolean;
  [capability: string]: boolean | undefined;
};

export type EntitlementAmounts = Partial<
  Record<Exclude<EntitlementResource, 'sharing' | 'pdfExport' | 'branding'>, number>
>;

/** A `null` limit means unlimited. */
export type EntitlementLimits = Partial<
  Record<Exclude<EntitlementResource, 'sharing' | 'pdfExport' | 'branding'>, number | null>
>;

export type EntitlementSnapshot = {
  /** Only for gyms: the tier their limits come from. */
  gymTier?: GymTier;
  capabilities?: EntitlementCapabilities;
  limits?: EntitlementLimits;
  usage?: EntitlementAmounts;
  isCoveredClient?: boolean;
  downgradeEffectiveAt?: string | null;
};

export type MyPermissionsResponse = {
  permissions: PermissionCell[];
  hasPaid?: boolean;
  plan?: PlanName;
  role?: RoleName | string;
  entitlements?: EntitlementSnapshot | null;
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
  hasPaid: boolean;
  plan?: PlanName;
  entitlementDowngradedAt?: string | null;
  downgradeEffectiveAt?: string | null;
  roleId: string;
  role: { id: string; name: string };
  createdAt: string;
};

export type AdminUserPatch = {
  roleId?: string;
  isActive?: boolean;
  hasPaid?: boolean;
  /** Tier to grant or switch to; the API defaults new grants to Plus. */
  paidPlan?: PaidPlan;
};

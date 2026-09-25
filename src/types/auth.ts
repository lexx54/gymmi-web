import type { PlanName } from './rbac';

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
  hasPaid: boolean;
  plan?: PlanName;
  role: { id: string; name: string };
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginParams = {
  identifier: string;
  password: string;
};

export type UserProfileParams = {
  age: number;
  gender: string;
  height: number; // in cm
  weight: number; // in kg
  goal?: string;
};

export type TrainerProfileParams = {
  description: string;
  monthlyPrice: number;
  specializations: string[];
  gyms?: string[];
  logoUrl?: string;
};

export type SignupParams = {
  email: string;
  username: string;
  password: string;
  role: string;
  avatarUrl?: string;
  profile?: UserProfileParams;
  trainerProfile?: TrainerProfileParams;
};

export type ForgotPasswordParams = {
  email: string;
};

export type ResetPasswordParams = {
  email: string;
  code: string;
  newPassword: string;
};

export type FullUserProfile = {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
  hasPaid: boolean;
  plan?: PlanName;
  role: { id: string; name: string };
  profile?: {
    id: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    goal: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  trainerProfile?: {
    id: string;
    description: string;
    monthlyPrice: number;
    specializations: string[];
    gyms: string[];
    logoUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
  } | null;
};

export type UpdateProfilePayload = {
  avatarUrl?: string;
  profile?: Partial<UserProfileParams>;
  trainerProfile?: Partial<TrainerProfileParams>;
};

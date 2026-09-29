import type { PlanName } from './rbac';
import type { GymProfile } from './gym';

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
  hasPaid: boolean;
  paidUntil?: string | null;
  plan?: PlanName;
  role: { id: string; name: string };
  gymProfile?: GymProfile | null;
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

export type GymProfileParams = {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  logoUrl?: string;
  coverUrl?: string;
  websiteUrl?: string;
  phoneNumber?: string;
  amenities?: string[];
};

export type SignupParams = {
  email: string;
  username: string;
  password: string;
  role: string;
  avatarUrl?: string;
  profile?: UserProfileParams;
  trainerProfile?: TrainerProfileParams;
  gymProfile?: GymProfileParams;
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
  paidUntil?: string | null;
  plan?: PlanName;
  role: { id: string; name: string };
  gymProfile?: GymProfile | null;
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
  gymProfile?: Partial<GymProfileParams>;
};


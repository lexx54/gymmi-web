export type GymTier = 'trial' | 'plus' | 'pro' | 'maximum';

export interface GymProfile {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  websiteUrl?: string | null;
  phoneNumber?: string | null;
  amenities?: string[] | null;
  tier: GymTier;
  trialEndsAt: string;
  memberCapacity: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GymMember {
  id: string;
  gymId: string;
  clientId: string;
  status: 'ACTIVE' | 'CANCELLED';
  joinedAt: string;
  client?: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string | null;
    userProfile?: {
      id?: string;
      age?: number;
      gender?: string;
      height?: number;
      weight?: number;
      goal?: string;
    } | null;
  };
}

export interface GymCoach {
  id: string;
  gymId: string;
  trainerId: string;
  canPublishRoutines: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  affiliatedAt: string;
  trainer?: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string | null;
    userProfile?: {
      id?: string;
      gender?: string;
    } | null;
    trainerProfile?: {
      id?: string;
      description?: string;
      monthlyPrice?: number;
      specializations?: string[];
      logoUrl?: string | null;
    } | null;
  };
}

export interface GymDashboardData {
  gym: GymProfile;
  activeMembersCount: number;
  capacity: number;
  coachesCount: number;
  routinesCount: number;
  trialDaysRemaining: number | null;
  isTrialActive: boolean;
}

export interface PublicGymItem extends GymProfile {
  activeMembersCount?: number;
  coachesCount?: number;
  routinesCount?: number;
}

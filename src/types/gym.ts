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
  joinCode?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GymMember {
  id: string;
  gymId: string;
  clientId: string;
  username?: string;
  email?: string;
  avatarUrl?: string | null;
  goal?: string | null;
  status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'CANCELLED';
  joinedAt: string;
  client?: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string | null;
    profile?: {
      id?: string;
      age?: number;
      gender?: string;
      height?: number;
      weight?: number;
      goal?: string;
    } | null;
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
  username?: string;
  email?: string;
  avatarUrl?: string | null;
  logoUrl?: string | null;
  monthlyPrice?: number;
  description?: string;
  specializations?: string[];
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
  id?: string;
  name?: string;
  tier?: GymTier;
  gym?: GymProfile;
  activeMembersCount: number;
  capacity: number;
  memberCapacity?: number;
  coachesCount: number;
  activeCoachesCount?: number;
  pendingMembersCount?: number;
  routinesCount: number;
  catalogRoutinesCount?: number;
  trialDaysRemaining: number | null;
  daysRemainingInTrial?: number | null;
  isTrialActive: boolean;
  joinCode?: string | null;
  logoUrl?: string | null;
}

export interface GymMembershipItem {
  id: string;
  gymId: string;
  status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'CANCELLED';
  name?: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  amenities?: string[];
  joinedAt: string;
}

export interface PublicGymItem extends GymProfile {
  activeMembersCount?: number;
  memberCount?: number;
  coachCount?: number;
  coachesCount?: number;
  routinesCount?: number;
}

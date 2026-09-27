export type StrengthTier =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Unranked';

export interface ClassificationEntry {
  rank: number | null;
  user: {
    id: string;
    username: string;
    email: string;
    avatarUrl: string | null;
  };
  tier: StrengthTier;
  bestWeightKg: number | null;
  bestReps: number | null;
  estimated1RmKg: number | null;
  achievedAt: string | null;
}

export interface ClassificationExerciseOption {
  id: string;
  name: string;
  isCore: boolean;
  category?: string;
}

export interface TierDistribution {
  diamond: number;
  platinum: number;
  gold: number;
  silver: number;
  bronze: number;
  unranked: number;
  total: number;
}

export interface ClassificationsData {
  cohortType: 'gym' | 'trainer';
  cohortId: string;
  cohortName: string;
  timeframe: 'weekly' | 'monthly' | 'all-time';
  exercise: {
    id: string;
    name: string;
    category?: string;
    isCore?: boolean;
    targetMuscle?: { en?: string; es?: string } | null;
  };
  availableExercises: ClassificationExerciseOption[];
  tierDistribution: TierDistribution;
  rankings: ClassificationEntry[];
}

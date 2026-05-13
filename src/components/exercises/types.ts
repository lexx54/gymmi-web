export type Difficulty = 'Novice' | 'Intermediate' | 'Elite';

export type MovementType = 'Compound' | 'Isolation';

/** Muscle name from API (`GET /list/muscles`) or legacy string values. */
export type TargetMuscle = string;

export type Equipment = string;

export type ExerciseTag = string;

export type ExerciseDraft = {
  name: string;
  targetMuscle: TargetMuscle;
  equipment: Equipment;
  instructions: string;
  difficulty: Difficulty;
  movementType: MovementType | null;
  tags: ExerciseTag[];
};

export type ExerciseSummary = {
  id: string;
  name: string;
  targetMuscle: TargetMuscle;
  equipment: Equipment;
  difficulty: Difficulty;
  tags: ExerciseTag[];
};

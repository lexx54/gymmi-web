export type Difficulty = 'Novice' | 'Intermediate' | 'Elite';

export type MovementType = 'Compound' | 'Isolation';

export type TargetMuscle =
  | 'Quads'
  | 'Hamstrings'
  | 'Chest'
  | 'Back'
  | 'Shoulders';

export type Equipment =
  | 'Dumbbells'
  | 'Barbell'
  | 'Cable Machine'
  | 'Kettlebell'
  | 'Bodyweight';

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

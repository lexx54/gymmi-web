export type Category = 'All' | 'Chest' | 'Back' | 'Legs' | 'Core';

export type LibraryExercise = {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  modality: 'Compound' | 'Bodyweight' | 'Isolation';
  imageUrl: string;
};

export type SetEntry = {
  id: string;
  weight: number;
  reps: number;
  rest: string;
  rpe: number;
};

export type RoutineExercise = {
  id: string;
  exerciseId: string;
  name: string;
  target: string;
  sets: SetEntry[];
};

export type SetField = 'weight' | 'reps' | 'rpe';

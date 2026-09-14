import type { SupersetColor } from '../../services/api/workouts';

export type LibraryExercise = {
  id: string;
  name: string;
  category: string;
  modality: string;
  imageUrl?: string;
};

export type SetEntry = {
  id: string;
  weight: number;
  reps: number;
  restSeconds: number;
  rpe: number;
};

export type RoutineExercise = {
  id: string;
  exerciseId: string;
  name: string;
  target: string;
  supersetColor: SupersetColor | null;
  sets: SetEntry[];
};

export type SetField = 'weight' | 'reps' | 'restSeconds' | 'rpe';

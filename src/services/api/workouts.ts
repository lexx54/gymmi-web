import type { Exercise } from './exercises';
import apiClient from './client';

export const WORKOUT_PERIODS = ['WEEK', 'BIWEEK', 'MONTH', 'TRIMESTER', 'CUSTOM'] as const;
export type WorkoutPeriod = (typeof WORKOUT_PERIODS)[number];

export const SUPERSET_COLORS = ['#ff535a', '#ffb347', '#55c2ff', '#9b7bff'] as const;
export type SupersetColor = (typeof SUPERSET_COLORS)[number];

export type WorkoutSetWrite = {
  weight: number;
  reps: number;
  restSeconds: number;
  rpe: number;
};

export type WorkoutExerciseWrite = {
  exerciseId: string;
  supersetColor?: SupersetColor | null;
  sets: WorkoutSetWrite[];
};

export type WorkoutDayWrite = {
  weekday: number;
  weekStartDate?: string | null;
  exercises: WorkoutExerciseWrite[];
};

export type WorkoutRoutineWrite = {
  name: string;
  description?: string | null;
  days: WorkoutDayWrite[];
};

export type WorkoutSet = WorkoutSetWrite & {
  id: string;
  position: number;
};

export type WorkoutRoutineExercise = {
  id: string;
  exerciseId: string;
  position: number;
  supersetColor: SupersetColor | null;
  exercise: Exercise;
  sets: WorkoutSet[];
};

export type WorkoutDay = {
  id: string;
  weekday: number;
  weekStartDate: string | null;
  position: number;
  exercises: WorkoutRoutineExercise[];
};

export type WorkoutRoutine = {
  id: string;
  name: string;
  description: string | null;
  createdById: string;
  forkedFromId?: string | null;
  days: WorkoutDay[];
  createdAt: string;
  updatedAt: string;
  assignment?: WorkoutAssignmentWindow | null;
};

export type WorkoutAssignmentWindow = {
  id: string;
  clientId: string;
  assignedById: string;
  startDate: string;
  endDate: string;
  period: WorkoutPeriod;
};

export type WorkoutSessionNote = {
  id: string;
  clientId: string;
  routineId: string;
  weekday: number;
  weekStartDate: string;
  status: 'COMPLETED' | 'INCOMPLETE';
  stopReason: string | null;
};

export type EligibleWorkoutUser = {
  id: string;
  email: string;
  username: string;
  role: { id: string; name: string };
};

export type WorkoutAssignment = {
  id: string;
  routineId: string;
  clientId: string;
  assignedById: string;
  sourceRoutineId?: string | null;
  period: WorkoutPeriod;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  routine?: WorkoutRoutine;
};

export type AssignmentWrite = {
  period: WorkoutPeriod;
  customEndDate?: string;
};

export async function fetchWorkouts(): Promise<WorkoutRoutine[]> {
  const { data } = await apiClient.get<WorkoutRoutine[]>('/workouts');
  return data;
}

export async function fetchWorkout(id: string): Promise<WorkoutRoutine> {
  const { data } = await apiClient.get<WorkoutRoutine>(`/workouts/${id}`);
  return data;
}

export async function createWorkout(params: WorkoutRoutineWrite): Promise<WorkoutRoutine> {
  const { data } = await apiClient.post<WorkoutRoutine>('/workouts', params);
  return data;
}

export async function updateWorkout(
  id: string,
  params: Partial<WorkoutRoutineWrite>,
): Promise<WorkoutRoutine> {
  const { data } = await apiClient.patch<WorkoutRoutine>(`/workouts/${id}`, params);
  return data;
}

export async function deleteWorkout(id: string): Promise<void> {
  await apiClient.delete(`/workouts/${id}`);
}

export async function shareWorkout(id: string, trainerIds: string[]): Promise<void> {
  await apiClient.put(`/workouts/${id}/shares`, { trainerIds });
}

export async function assignWorkout(
  id: string,
  params: AssignmentWrite & { clientId: string },
): Promise<WorkoutAssignment> {
  const { data } = await apiClient.post<WorkoutAssignment>(`/workouts/${id}/assignments`, params);
  return data;
}

export async function selfAssignWorkout(
  routineId: string,
  params: AssignmentWrite,
): Promise<WorkoutAssignment> {
  const { data } = await apiClient.post<WorkoutAssignment>('/workouts/assignments/me', {
    routineId,
    ...params,
  });
  return data;
}

export async function fetchMyWorkoutAssignment(): Promise<WorkoutAssignment | null> {
  const { data } = await apiClient.get<WorkoutAssignment | null>('/workouts/assignments/me');
  return data;
}

export async function fetchEligibleClients(): Promise<EligibleWorkoutUser[]> {
  const { data } = await apiClient.get<EligibleWorkoutUser[]>('/workouts/eligible-clients');
  return data;
}

export async function fetchEligibleTrainers(): Promise<EligibleWorkoutUser[]> {
  const { data } = await apiClient.get<EligibleWorkoutUser[]>('/workouts/eligible-trainers');
  return data;
}

/** Fetches every logged day on an assignment fork for the assigning trainer. */
export async function fetchRoutineSessions(id: string): Promise<WorkoutSessionNote[]> {
  const { data } = await apiClient.get<WorkoutSessionNote[]>(`/workouts/${id}/sessions`);
  return data;
}

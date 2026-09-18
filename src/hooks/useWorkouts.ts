import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  assignWorkout,
  createWorkout,
  deleteWorkout,
  fetchEligibleClients,
  fetchEligibleTrainers,
  fetchMyWorkoutAssignment,
  fetchWorkout,
  fetchWorkouts,
  fetchRoutineSessions,
  selfAssignWorkout,
  shareWorkout,
  updateWorkout,
  type AssignmentWrite,
  type WorkoutRoutineWrite,
} from '../services/api/workouts';

export const workoutsQueryKey = ['workouts'] as const;
export const myWorkoutAssignmentQueryKey = ['workouts', 'assignments', 'me'] as const;
export const workoutQueryKey = (id: string) => [...workoutsQueryKey, id] as const;

export function useWorkouts() {
  return useQuery({ queryKey: workoutsQueryKey, queryFn: fetchWorkouts });
}

export function useWorkout(id: string | undefined) {
  return useQuery({
    queryKey: workoutQueryKey(id ?? ''),
    queryFn: () => fetchWorkout(id!),
    enabled: Boolean(id),
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkout,
    onSuccess: (routine) => {
      queryClient.invalidateQueries({ queryKey: workoutsQueryKey });
      queryClient.setQueryData(workoutQueryKey(routine.id), routine);
    },
  });
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: Partial<WorkoutRoutineWrite> }) =>
      updateWorkout(id, params),
    onSuccess: (routine) => {
      queryClient.invalidateQueries({ queryKey: workoutsQueryKey });
      queryClient.setQueryData(workoutQueryKey(routine.id), routine);
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkout,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: workoutsQueryKey });
      queryClient.removeQueries({ queryKey: workoutQueryKey(id) });
    },
  });
}

export function useEligibleClients(enabled: boolean) {
  return useQuery({
    queryKey: ['workouts', 'eligible-clients'],
    queryFn: fetchEligibleClients,
    enabled,
  });
}

export function useEligibleTrainers(enabled: boolean) {
  return useQuery({
    queryKey: ['workouts', 'eligible-trainers'],
    queryFn: fetchEligibleTrainers,
    enabled,
  });
}

export function useShareWorkout() {
  return useMutation({
    mutationFn: ({ id, trainerIds }: { id: string; trainerIds: string[] }) =>
      shareWorkout(id, trainerIds),
  });
}

export function useAssignWorkout() {
  return useMutation({
    mutationFn: ({ id, clientId, ...params }: AssignmentWrite & { id: string; clientId: string }) =>
      assignWorkout(id, { clientId, ...params }),
  });
}

export function useSelfAssignWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routineId, ...params }: AssignmentWrite & { routineId: string }) =>
      selfAssignWorkout(routineId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myWorkoutAssignmentQueryKey });
      queryClient.invalidateQueries({ queryKey: workoutsQueryKey });
    },
  });
}

export function useMyWorkoutAssignment(enabled = true) {
  return useQuery({
    queryKey: myWorkoutAssignmentQueryKey,
    queryFn: fetchMyWorkoutAssignment,
    enabled,
  });
}

export function useRoutineSessions(id: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: [...workoutQueryKey(id ?? ''), 'sessions'],
    queryFn: () => fetchRoutineSessions(id!),
    enabled: Boolean(id) && enabled,
  });
}


import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createExercise,
  deleteExercise,
  fetchExercise,
  fetchExercises,
  updateExercise,
  uploadExerciseBulkCsv,
  type CreateExerciseParams,
  type Exercise,
  type UpdateExerciseParams,
} from '../services/api/exercises';

const exercisesQueryKey = ['exercises'] as const;

export function exerciseQueryKey(id: string) {
  return [...exercisesQueryKey, id] as const;
}

export function useExercises() {
  return useQuery<Exercise[]>({
    queryKey: exercisesQueryKey,
    queryFn: fetchExercises,
    staleTime: 1000 * 60 * 5,
  });
}

export function useExercise(id: string | undefined) {
  return useQuery<Exercise>({
    queryKey: exerciseQueryKey(id ?? ''),
    queryFn: () => fetchExercise(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateExerciseParams) => createExercise(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exercisesQueryKey });
    },
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateExerciseParams }) =>
      updateExercise(id, params),
    onSuccess: (exercise) => {
      queryClient.invalidateQueries({ queryKey: exercisesQueryKey });
      queryClient.setQueryData(exerciseQueryKey(exercise.id), exercise);
    },
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExercise(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: exercisesQueryKey });
      queryClient.removeQueries({ queryKey: exerciseQueryKey(id) });
    },
  });
}

export function useUploadExerciseBulkCsv() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadExerciseBulkCsv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exercisesQueryKey });
    },
  });
}

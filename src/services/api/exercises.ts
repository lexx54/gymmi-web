import apiClient from './client';

export type Exercise = {
  id: string;
  name: string;
  targetMuscle: string;
  equipment: string;
  instructions: string;
  difficulty: string;
  movementType: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateExerciseParams = {
  name: string;
  targetMuscle: string;
  equipment: string;
  instructions: string;
  difficulty: string;
  movementType?: string | null;
  tags: string[];
};

export type UpdateExerciseParams = Partial<CreateExerciseParams>;

export type BulkExerciseCsvResult = {
  created: number;
  errors: Array<{ row: number; message: string }>;
};

export async function fetchExercises(): Promise<Exercise[]> {
  const { data } = await apiClient.get<Exercise[]>('/exercises');
  return data;
}

export async function fetchExercise(id: string): Promise<Exercise> {
  const { data } = await apiClient.get<Exercise>(`/exercises/${id}`);
  return data;
}

export async function createExercise(params: CreateExerciseParams): Promise<Exercise> {
  const { data } = await apiClient.post<Exercise>('/exercises', params);
  return data;
}

export async function updateExercise(
  id: string,
  params: UpdateExerciseParams,
): Promise<Exercise> {
  const { data } = await apiClient.patch<Exercise>(`/exercises/${id}`, params);
  return data;
}

export async function deleteExercise(id: string): Promise<void> {
  await apiClient.delete(`/exercises/${id}`);
}

/**
 * Uploads a CSV file for bulk exercise creation.
 */
export async function uploadExerciseBulkCsv(file: File): Promise<BulkExerciseCsvResult> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post<BulkExerciseCsvResult>('/exercises/bulk-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

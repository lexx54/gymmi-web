import apiClient from './client';

export type LocalizedText = {
  en: string;
  es: string;
};

export type ExerciseActivationMap = {
  principal: LocalizedText;
  secondary: LocalizedText;
  stabilizers: LocalizedText;
};

export type ExerciseActivationInput = Omit<ExerciseActivationMap, 'principal'>;

export type Exercise = {
  id: string;
  name: string;
  targetMuscle: LocalizedText;
  equipment: LocalizedText;
  instructions: LocalizedText;
  activationMap: ExerciseActivationMap;
  difficulty: string;
  movementType: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateExerciseParams = {
  name: string;
  targetMuscle: LocalizedText;
  equipment: LocalizedText;
  instructions: LocalizedText;
  activationMap: ExerciseActivationInput;
  difficulty: string;
  movementType?: string | null;
  tags: string[];
};

export type UpdateExerciseParams = Partial<CreateExerciseParams>;

export type BulkExerciseCsvResult = {
  created: number;
  errors: Array<{ row: number; message: string }>;
};

/**
 * Resolves bilingual API content for the active UI language with English,
 * then Spanish, fallback.
 */
export function resolveLocalizedText(
  value: LocalizedText,
  language?: string,
): string {
  const preferred = language?.toLowerCase().startsWith('es') ? value.es : value.en;
  return preferred.trim() || value.en.trim() || value.es.trim();
}

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

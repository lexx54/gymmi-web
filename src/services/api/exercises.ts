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

function tryParseJson(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return value;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readLocale(record: Record<string, unknown>, locale: 'en' | 'es'): unknown {
  return locale === 'es' ? (record.es ?? record.ES) : (record.en ?? record.EN);
}

function leafString(value: unknown): string {
  const parsed = tryParseJson(value);
  if (typeof parsed === 'string') {
    return parsed;
  }
  if (typeof parsed === 'number' || typeof parsed === 'boolean') {
    return String(parsed);
  }
  return '';
}

/**
 * Normalizes bilingual API/DB values, including nested JSON strings left by
 * the varchar → jsonb conversion.
 */
export function unwrapLocalizedText(value: unknown): LocalizedText {
  let current = tryParseJson(value);

  for (let index = 0; index < 3; index += 1) {
    if (!isRecord(current)) {
      break;
    }

    const enValue = tryParseJson(readLocale(current, 'en'));
    const esValue = tryParseJson(readLocale(current, 'es'));

    if (isRecord(enValue) && (readLocale(enValue, 'en') != null || readLocale(enValue, 'es') != null)) {
      const esSource = isRecord(esValue) ? esValue : enValue;
      current = {
        en: leafString(readLocale(enValue, 'en')) || leafString(readLocale(enValue, 'es')),
        es: leafString(readLocale(esSource, 'es')) || leafString(readLocale(esSource, 'en')),
      };
      continue;
    }

    return {
      en: leafString(enValue),
      es: leafString(esValue),
    };
  }

  if (typeof current === 'string') {
    return { en: current, es: current };
  }

  return { en: '', es: '' };
}

/**
 * Resolves bilingual API content for the active UI language with English,
 * then Spanish, fallback.
 */
export function resolveLocalizedText(
  value: LocalizedText | string | null | undefined,
  language?: string,
): string {
  const localized = unwrapLocalizedText(value);
  const preferred = language?.toLowerCase().startsWith('es')
    ? localized.es
    : localized.en;
  return preferred.trim() || localized.en.trim() || localized.es.trim();
}

function normalizeExercise(exercise: Exercise): Exercise {
  return {
    ...exercise,
    targetMuscle: unwrapLocalizedText(exercise.targetMuscle),
    equipment: unwrapLocalizedText(exercise.equipment),
    instructions: unwrapLocalizedText(exercise.instructions),
    activationMap: {
      principal: unwrapLocalizedText(exercise.activationMap?.principal),
      secondary: unwrapLocalizedText(exercise.activationMap?.secondary),
      stabilizers: unwrapLocalizedText(exercise.activationMap?.stabilizers),
    },
  };
}

export async function fetchExercises(): Promise<Exercise[]> {
  const { data } = await apiClient.get<Exercise[]>('/exercises');
  return data.map(normalizeExercise);
}

export async function fetchExercise(id: string): Promise<Exercise> {
  const { data } = await apiClient.get<Exercise>(`/exercises/${id}`);
  return normalizeExercise(data);
}

export async function createExercise(params: CreateExerciseParams): Promise<Exercise> {
  const { data } = await apiClient.post<Exercise>('/exercises', params);
  return normalizeExercise(data);
}

export async function updateExercise(
  id: string,
  params: UpdateExerciseParams,
): Promise<Exercise> {
  const { data } = await apiClient.patch<Exercise>(`/exercises/${id}`, params);
  return normalizeExercise(data);
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

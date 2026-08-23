import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchExercises,
  fetchExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  resolveLocalizedText,
  uploadExerciseBulkCsv,
} from './exercises';
import apiClient from './client';

vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockGet = apiClient.get as ReturnType<typeof vi.fn>;
const mockPost = apiClient.post as ReturnType<typeof vi.fn>;
const mockPatch = apiClient.patch as ReturnType<typeof vi.fn>;
const mockDelete = apiClient.delete as ReturnType<typeof vi.fn>;

const exerciseId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

const sampleExercise = {
  id: exerciseId,
  name: 'Squat',
  targetMuscle: { en: 'Quads', es: 'Cuádriceps' },
  equipment: { en: 'Barbell', es: 'Barra' },
  instructions: { en: 'Descend and ascend', es: 'Desciende y asciende' },
  activationMap: {
    principal: { en: 'Quads', es: 'Cuádriceps' },
    secondary: { en: 'Glutes', es: 'Glúteos' },
    stabilizers: { en: 'Calves', es: 'Pantorrillas' },
  },
  difficulty: 'Intermediate',
  movementType: 'Compound',
  tags: ['Strength'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const createParams = {
  name: 'Squat',
  targetMuscle: { en: 'Quads', es: 'Cuádriceps' },
  equipment: { en: 'Barbell', es: 'Barra' },
  instructions: { en: 'Descend and ascend', es: 'Desciende y asciende' },
  activationMap: {
    secondary: { en: 'Glutes', es: 'Glúteos' },
    stabilizers: { en: 'Calves', es: 'Pantorrillas' },
  },
  difficulty: 'Intermediate',
  movementType: 'Compound',
  tags: ['Strength'],
};

beforeEach(() => {
  mockGet.mockReset();
  mockPost.mockReset();
  mockPatch.mockReset();
  mockDelete.mockReset();
});

describe('resolveLocalizedText', () => {
  it('should resolve Spanish and fall back to English when Spanish is empty', () => {
    expect(
      resolveLocalizedText({ en: 'Quads', es: 'Cuádriceps' }, 'es'),
    ).toBe('Cuádriceps');
    expect(resolveLocalizedText({ en: 'Quads', es: '' }, 'es')).toBe('Quads');
  });

  it('should unwrap nested JSON strings stored in en/es', () => {
    expect(
      resolveLocalizedText(
        {
          en: '{"en": "Chest", "es": "Pecho"}',
          es: '{"en": "Chest", "es": "Pecho"}',
        },
        'es',
      ),
    ).toBe('Pecho');
    expect(
      resolveLocalizedText(
        {
          en: '{"en": "Barbell", "es": "Barra"}',
          es: '{"en": "Barbell", "es": "Barra"}',
        },
        'en',
      ),
    ).toBe('Barbell');
  });
});

describe('fetchExercises', () => {
  it('should GET /exercises and return exercises', async () => {
    const exercises = [sampleExercise];
    mockGet.mockResolvedValue({ data: exercises });

    const result = await fetchExercises();

    expect(mockGet).toHaveBeenCalledWith('/exercises');
    expect(result).toEqual(exercises);
  });

  it('should propagate errors', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));

    await expect(fetchExercises()).rejects.toThrow('Network Error');
  });
});

describe('fetchExercise', () => {
  it('should GET /exercises/:id and return exercise', async () => {
    mockGet.mockResolvedValue({ data: sampleExercise });

    const result = await fetchExercise(exerciseId);

    expect(mockGet).toHaveBeenCalledWith(`/exercises/${exerciseId}`);
    expect(result).toEqual(sampleExercise);
  });

  it('should propagate errors', async () => {
    mockGet.mockRejectedValue(new Error('Not Found'));

    await expect(fetchExercise(exerciseId)).rejects.toThrow('Not Found');
  });
});

describe('createExercise', () => {
  it('should POST to /exercises and return created exercise', async () => {
    mockPost.mockResolvedValue({ data: sampleExercise });

    const result = await createExercise(createParams);

    expect(mockPost).toHaveBeenCalledWith('/exercises', createParams);
    expect(result).toEqual(sampleExercise);
  });

  it('should propagate errors', async () => {
    mockPost.mockRejectedValue(new Error('Validation failed'));

    await expect(createExercise(createParams)).rejects.toThrow('Validation failed');
  });
});

describe('updateExercise', () => {
  it('should PATCH /exercises/:id and return updated exercise', async () => {
    const params = { name: 'Front Squat' };
    const updated = { ...sampleExercise, ...params };
    mockPatch.mockResolvedValue({ data: updated });

    const result = await updateExercise(exerciseId, params);

    expect(mockPatch).toHaveBeenCalledWith(`/exercises/${exerciseId}`, params);
    expect(result).toEqual(updated);
  });

  it('should propagate errors', async () => {
    mockPatch.mockRejectedValue(new Error('Not Found'));

    await expect(updateExercise(exerciseId, { name: 'X' })).rejects.toThrow('Not Found');
  });
});

describe('deleteExercise', () => {
  it('should DELETE /exercises/:id', async () => {
    mockDelete.mockResolvedValue({ data: undefined });

    await deleteExercise(exerciseId);

    expect(mockDelete).toHaveBeenCalledWith(`/exercises/${exerciseId}`);
  });

  it('should propagate errors', async () => {
    mockDelete.mockRejectedValue(new Error('Forbidden'));

    await expect(deleteExercise(exerciseId)).rejects.toThrow('Forbidden');
  });
});

describe('uploadExerciseBulkCsv', () => {
  it('should POST file to /exercises/bulk-csv with multipart headers', async () => {
    const file = new File(['name,targetMuscle\nSquat,Quads'], 'exercises.csv', {
      type: 'text/csv',
    });
    const response = {
      created: 2,
      errors: [{ row: 3, message: 'Missing name' }],
    };
    mockPost.mockResolvedValue({ data: response });

    const result = await uploadExerciseBulkCsv(file);

    expect(mockPost).toHaveBeenCalledWith(
      '/exercises/bulk-csv',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    const formData = mockPost.mock.calls[0][1] as FormData;
    expect(formData.get('file')).toBe(file);
    expect(result).toEqual(response);
  });

  it('should propagate errors', async () => {
    const file = new File([''], 'exercises.csv', { type: 'text/csv' });
    mockPost.mockRejectedValue(new Error('Upload failed'));

    await expect(uploadExerciseBulkCsv(file)).rejects.toThrow('Upload failed');
  });
});

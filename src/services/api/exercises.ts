import apiClient from './client';

export type BulkExerciseCsvResult = {
  created: number;
  errors: Array<{ row: number; message: string }>;
};

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

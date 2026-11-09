import { useCallback, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ApiErrorDetails } from '../services/api/errors';
import { exportWorkoutPdf } from '../services/api/workouts';
import { useFeatureUpsell } from './useFeatureUpsell';

type ExportableRoutine = { id: string; name: string };

/** A safe file name for the downloaded PDF. */
export function routinePdfFileName(name: string): string {
  const slug = name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60);
  return `${slug || 'routine'}.pdf`;
}

/** Reads the JSON error body of a failed `responseType: 'blob'` request. */
async function blobErrorDetails(error: unknown): Promise<ApiErrorDetails | undefined> {
  const data = (error as AxiosError<unknown>)?.response?.data;
  if (data instanceof Blob) {
    try {
      return JSON.parse(await data.text()) as ApiErrorDetails;
    } catch {
      return undefined;
    }
  }
  return data as ApiErrorDetails | undefined;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Exports routines to PDF (Coach Pro, Athlete Pro, Gym Pro and Gym Maximum).
 * Users without the perk get the Pro / Gym Pro upsell instead of a request.
 */
export function useRoutinePdfExport(): {
  exportPdf: (routine: ExportableRoutine) => Promise<void>;
  exportingId: string | null;
  upsellModal: ReactNode;
} {
  const { t } = useTranslation();
  const { requireFeature, showUpsell, upsellModal } = useFeatureUpsell('pdfExport');
  const [exportingId, setExportingId] = useState<string | null>(null);

  const exportPdf = useCallback(
    async (routine: ExportableRoutine) => {
      if (!requireFeature()) return;
      setExportingId(routine.id);
      try {
        const blob = await exportWorkoutPdf(routine.id);
        downloadBlob(blob, routinePdfFileName(routine.name));
      } catch (error) {
        const details = await blobErrorDetails(error);
        if (details?.code === 'PLAN_LIMIT') showUpsell(details);
        else toast.error(t('workouts.exportPdfFailed'));
      } finally {
        setExportingId(null);
      }
    },
    [requireFeature, showUpsell, t],
  );

  return { exportPdf, exportingId, upsellModal };
}

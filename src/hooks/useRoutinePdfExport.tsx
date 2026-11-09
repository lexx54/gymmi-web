import { useCallback, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { PlusUpsellModal } from '../components/entitlements/PlusUpsellModal';
import type { ApiErrorDetails } from '../services/api/errors';
import { exportWorkoutPdf } from '../services/api/workouts';
import { hasEntitlementCapability, useEntitlements } from './usePermissions';

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
  const { data: entitlements, plan } = useEntitlements();
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [upsell, setUpsell] = useState<ApiErrorDetails | null>(null);

  const upsellDetails = useCallback((): ApiErrorDetails => {
    if (entitlements?.gymTier) {
      return {
        code: 'PLAN_LIMIT',
        resource: 'pdfExport',
        scope: 'gym',
        plan: entitlements.gymTier,
        message: t('entitlements.gymPdfExport'),
      };
    }
    return { code: 'PLAN_LIMIT', resource: 'pdfExport', plan, message: t('entitlements.pdfExport') };
  }, [entitlements?.gymTier, plan, t]);

  const exportPdf = useCallback(
    async (routine: ExportableRoutine) => {
      if (!hasEntitlementCapability(entitlements?.capabilities, 'canExportPdf')) {
        setUpsell(upsellDetails());
        return;
      }
      setExportingId(routine.id);
      try {
        const blob = await exportWorkoutPdf(routine.id);
        downloadBlob(blob, routinePdfFileName(routine.name));
      } catch (error) {
        const details = await blobErrorDetails(error);
        if (details?.code === 'PLAN_LIMIT') setUpsell({ ...upsellDetails(), ...details });
        else toast.error(t('workouts.exportPdfFailed'));
      } finally {
        setExportingId(null);
      }
    },
    [entitlements?.capabilities, t, upsellDetails],
  );

  const upsellModal = (
    <PlusUpsellModal
      isOpen={Boolean(upsell)}
      details={upsell ?? undefined}
      onClose={() => setUpsell(null)}
    />
  );

  return { exportPdf, exportingId, upsellModal };
}

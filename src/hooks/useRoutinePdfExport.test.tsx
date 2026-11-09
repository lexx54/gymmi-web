import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { routinePdfFileName, useRoutinePdfExport } from './useRoutinePdfExport';

const exportWorkoutPdf = vi.fn();
const useEntitlements = vi.fn();
const toastError = vi.fn();

vi.mock('../services/api/workouts', () => ({
  exportWorkoutPdf: (id: string) => exportWorkoutPdf(id),
}));
vi.mock('./usePermissions', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./usePermissions')>()),
  useEntitlements: () => useEntitlements(),
}));
vi.mock('sonner', () => ({ toast: { error: (msg: string) => toastError(msg) } }));

const ROUTINE = { id: 'routine-1', name: 'Fuerza Torso / Pierna' };

function Harness() {
  const { exportPdf, exportingId, upsellModal } = useRoutinePdfExport();
  return (
    <MemoryRouter>
      <button type="button" onClick={() => void exportPdf(ROUTINE)}>
        {exportingId ? 'exporting' : 'export'}
      </button>
      {upsellModal}
    </MemoryRouter>
  );
}

describe('useRoutinePdfExport', () => {
  let clickedDownload: string | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    clickedDownload = undefined;
    URL.createObjectURL = vi.fn(() => 'blob:pdf');
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clickedDownload = this.download;
    });
  });

  it('builds an ASCII file name from the routine name', () => {
    expect(routinePdfFileName('Fuerza Torso / Pierna — Día 1')).toBe('fuerza-torso-pierna-dia-1.pdf');
  });

  it('downloads the PDF when the plan includes it', async () => {
    useEntitlements.mockReturnValue({ data: { capabilities: { canExportPdf: true } }, plan: 'pro' });
    exportWorkoutPdf.mockResolvedValue(new Blob(['%PDF-'], { type: 'application/pdf' }));

    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'export' }));

    await waitFor(() => expect(clickedDownload).toBe('fuerza-torso-pierna.pdf'));
    expect(exportWorkoutPdf).toHaveBeenCalledWith('routine-1');
  });

  it('shows the Pro upsell without calling the API for a Plus coach', async () => {
    useEntitlements.mockReturnValue({ data: { capabilities: { canExportPdf: false } }, plan: 'plus' });

    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'export' }));

    expect(await screen.findByRole('dialog')).toHaveAccessibleName('Unlock more with Pro');
    expect(screen.getByText('Exporting routines to PDF is included with Pro.')).toBeInTheDocument();
    expect(screen.getByText('Export any routine to a printable PDF')).toBeInTheDocument();
    expect(exportWorkoutPdf).not.toHaveBeenCalled();
  });

  it('points a trial gym at Gym Pro', async () => {
    useEntitlements.mockReturnValue({
      data: { gymTier: 'trial', capabilities: { canExportPdf: false } },
      plan: 'free',
    });

    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'export' }));

    expect(await screen.findByRole('dialog')).toHaveAccessibleName('Upgrade your gym plan');
    expect(screen.getByText('Exporting routines to PDF is included with Gym Pro and Gym Maximum.')).toBeInTheDocument();
    expect(screen.getByText('Gym Pro')).toBeInTheDocument();
  });

  it('turns a server PLAN_LIMIT into the upsell', async () => {
    useEntitlements.mockReturnValue({ data: { capabilities: {} }, plan: 'plus' });
    const body = new Blob([JSON.stringify({ code: 'PLAN_LIMIT', resource: 'pdfExport', plan: 'plus' })]);
    exportWorkoutPdf.mockRejectedValue({ response: { status: 403, data: body } });

    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'export' }));

    expect(await screen.findByRole('dialog')).toHaveAccessibleName('Unlock more with Pro');
    expect(toastError).not.toHaveBeenCalled();
  });

  it('shows an error toast for other failures', async () => {
    useEntitlements.mockReturnValue({ data: { capabilities: { canExportPdf: true } }, plan: 'pro' });
    exportWorkoutPdf.mockRejectedValue({ response: { status: 500, data: new Blob(['oops']) } });

    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'export' }));

    await waitFor(() => expect(toastError).toHaveBeenCalledWith('The PDF could not be exported. Try again.'));
  });
});

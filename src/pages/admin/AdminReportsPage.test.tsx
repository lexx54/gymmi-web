import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminReportsPage from './AdminReportsPage';
import * as moderationApi from '../../services/api/moderation';
import * as authContext from '../../context/AuthContext';
import { toast } from 'sonner';
import type { AdminReport } from '../../types/moderation';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('../../services/api/moderation', () => ({
  fetchAdminReports: vi.fn(),
  resolveAdminReport: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockFn = (fn: unknown) => fn as ReturnType<typeof vi.fn>;

const commentReport: AdminReport = {
  id: 'report-1',
  targetType: 'COMMENT',
  targetId: 'comm-1',
  reason: 'HARASSMENT',
  details: 'Insulting other members',
  contentSnapshot: 'You are all idiots',
  status: 'OPEN',
  resolutionNote: null,
  reviewedAt: null,
  createdAt: '2020-01-01T10:00:00.000Z',
  reporter: { id: 'user-1', username: 'alice' },
  targetUser: { id: 'user-2', username: 'troll', isActive: true },
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, createElement(AdminReportsPage)),
    ),
  );
}

describe('AdminReportsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFn(authContext.useAuth).mockReturnValue({
      user: {
        id: 'admin-1',
        username: 'adminboss',
        email: 'admin@gymmi.app',
        hasPaid: true,
        role: { id: 'r0', name: 'Admin' },
      },
      isAuthenticated: true,
      isLoading: false,
    });
    mockFn(moderationApi.fetchAdminReports).mockResolvedValue({
      items: [commentReport],
      total: 1,
      page: 1,
      limit: 20,
    });
    mockFn(moderationApi.resolveAdminReport).mockResolvedValue({
      id: 'report-1',
      status: 'ACTION_TAKEN',
    });
  });

  it('loads open reports and shows the reported content and parties', async () => {
    renderPage();

    expect(await screen.findByText('You are all idiots')).toBeInTheDocument();
    expect(moderationApi.fetchAdminReports).toHaveBeenCalledWith(1, 20, 'OPEN');
    expect(screen.getByText('troll')).toBeInTheDocument();
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('Harassment or bullying')).toBeInTheDocument();
    // Created long ago, so it is past the 24-hour review window.
    expect(screen.getByText('Over 24h')).toBeInTheDocument();
  });

  it('dismisses a report', async () => {
    renderPage();
    fireEvent.click(await screen.findByTestId('report-dismiss-report-1'));

    await waitFor(() => {
      expect(moderationApi.resolveAdminReport).toHaveBeenCalledWith('report-1', {
        status: 'DISMISSED',
      });
      expect(toast.success).toHaveBeenCalledWith('Report updated');
    });
  });

  it('removes the reported content', async () => {
    renderPage();
    fireEvent.click(await screen.findByTestId('report-remove-report-1'));

    await waitFor(() => {
      expect(moderationApi.resolveAdminReport).toHaveBeenCalledWith('report-1', {
        status: 'ACTION_TAKEN',
        removeContent: true,
      });
    });
  });

  it('removes content and deactivates the author after confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderPage();
    fireEvent.click(await screen.findByTestId('report-deactivate-report-1'));

    await waitFor(() => {
      expect(moderationApi.resolveAdminReport).toHaveBeenCalledWith('report-1', {
        status: 'ACTION_TAKEN',
        removeContent: true,
        deactivateUser: true,
      });
    });
    confirmSpy.mockRestore();
  });

  it('switches the status filter', async () => {
    renderPage();
    await screen.findByText('You are all idiots');
    fireEvent.click(screen.getByTestId('reports-filter-ALL'));

    await waitFor(() => {
      expect(moderationApi.fetchAdminReports).toHaveBeenCalledWith(1, 20, 'ALL');
    });
  });

  it('shows an empty state', async () => {
    mockFn(moderationApi.fetchAdminReports).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
    });
    renderPage();
    expect(await screen.findByTestId('reports-empty')).toBeInTheDocument();
  });
});

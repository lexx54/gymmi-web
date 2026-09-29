import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import AdminPaymentsPage from './AdminPaymentsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as paymentsApi from '../../services/api/payments';
import * as authContext from '../../context/AuthContext';
import { toast } from 'sonner';
import type { Payment, PaginatedPayments } from '../../types/payments';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../services/api/payments', () => ({
  fetchAdminPayments: vi.fn(),
  approveAdminPayment: vi.fn(),
  rejectAdminPayment: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockPendingPayment: Payment = {
  id: 'pay-pending-1',
  userId: 'user-1',
  roleName: 'Trainer',
  plan: 'plus',
  billingCycle: 'monthly',
  amountUsd: 3.99,
  amountVes: 160,
  paymentMethod: 'pago_movil',
  referenceNumber: 'REF-PM-101',
  originBank: 'Banesco',
  payerPhone: '0414-9998888',
  payerIdNumber: 'V-20111222',
  receiptUrl: 'https://r2.gymmi.app/receipts/test.jpg',
  status: 'PENDING',
  rejectionReason: null,
  reviewedById: null,
  reviewedAt: null,
  notes: 'Pago Móvil transfer',
  createdAt: '2026-09-29T10:00:00.000Z',
  updatedAt: '2026-09-29T10:00:00.000Z',
  user: {
    id: 'user-1',
    username: 'coach_mike',
    email: 'mike@trainer.com',
    avatarUrl: null,
    roleName: 'Trainer',
  },
};

const mockPaymentsResponse: PaginatedPayments = {
  items: [mockPendingPayment],
  total: 1,
  page: 1,
  limit: 20,
};

function renderAdminPaymentsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, createElement(AdminPaymentsPage)),
    ),
  );
}

describe('AdminPaymentsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (authContext.useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: {
        id: 'admin-1',
        username: 'adminboss',
        email: 'admin@gymmi.app',
        hasPaid: true,
        paidUntil: null,
        role: { id: 'r0', name: 'Admin' },
      },
      isAuthenticated: true,
      isLoading: false,
    });

    (paymentsApi.fetchAdminPayments as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPaymentsResponse,
    );
    (paymentsApi.approveAdminPayment as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'pay-pending-1',
      status: 'APPROVED',
    });
    (paymentsApi.rejectAdminPayment as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'pay-pending-1',
      status: 'REJECTED',
      rejectionReason: 'Invalid reference number',
    });
  });

  it('renders payment verification header and pending review item', async () => {
    renderAdminPaymentsPage();

    expect(await screen.findByText(/Payment Verifications/i)).toBeInTheDocument();
    expect(await screen.findByText('coach_mike')).toBeInTheDocument();
    expect(screen.getByText('REF-PM-101')).toBeInTheDocument();
    expect(screen.getByText('$3.99 USD')).toBeInTheDocument();
  });

  it('allows switching filter tabs between PENDING, APPROVED, REJECTED, ALL', async () => {
    renderAdminPaymentsPage();

    const approvedTab = await screen.findByRole('button', { name: /Approved/i });
    fireEvent.click(approvedTab);

    await waitFor(() => {
      expect(paymentsApi.fetchAdminPayments).toHaveBeenCalledWith(1, 20, 'APPROVED');
    });
  });

  it('opens approval confirmation modal and approves payment', async () => {
    renderAdminPaymentsPage();

    const approveBtn = await screen.findByTitle('Approve Payment');
    fireEvent.click(approveBtn);

    // Modal appears
    expect(screen.getAllByText(/Are you sure you want to approve this payment/i).length).toBeGreaterThan(0);

    // Confirm button inside modal
    const confirmButtons = screen.getAllByRole('button', { name: /Approve/i });
    const modalConfirmBtn = confirmButtons[confirmButtons.length - 1];
    fireEvent.click(modalConfirmBtn);

    await waitFor(() => {
      expect(paymentsApi.approveAdminPayment).toHaveBeenCalledWith('pay-pending-1');
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('opens rejection modal, inputs reason, and confirms rejection', async () => {
    renderAdminPaymentsPage();

    const rejectBtn = await screen.findByTitle('Reject Payment');
    fireEvent.click(rejectBtn);

    // Modal appears
    const input = screen.getByPlaceholderText(/Reference number not found/i);
    fireEvent.change(input, { target: { value: 'Reference not found in bank' } });

    // Confirm button inside modal
    const rejectButtons = screen.getAllByRole('button', { name: /Reject/i });
    const confirmRejectBtn = rejectButtons[rejectButtons.length - 1];
    fireEvent.click(confirmRejectBtn);

    await waitFor(() => {
      expect(paymentsApi.rejectAdminPayment).toHaveBeenCalledWith('pay-pending-1', {
        rejectionReason: 'Reference not found in bank',
      });
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('opens full receipt modal when thumbnail is clicked', async () => {
    renderAdminPaymentsPage();

    const receiptImg = await screen.findByAltText('Receipt');
    fireEvent.click(receiptImg);

    expect(screen.getByAltText('Full receipt screenshot')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open original/i })).toHaveAttribute(
      'href',
      'https://r2.gymmi.app/receipts/test.jpg',
    );
  });
});

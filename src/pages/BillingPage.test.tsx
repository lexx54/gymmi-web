import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import BillingPage from './BillingPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as paymentsApi from '../services/api/payments';
import * as authContext from '../context/AuthContext';
import * as userProfileHook from '../hooks/useUserProfile';
import type { Payment } from '../types/payments';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../services/api/payments', () => ({
  fetchPaymentConfig: vi.fn(),
  fetchMyPayments: vi.fn(),
  createPayment: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../hooks/useUserProfile', () => ({
  useUserProfile: vi.fn(),
}));

const mockConfig = {
  pagoMovil: {
    bank: 'Banesco (0134)',
    phone: '0412-1234567',
    idNumber: 'V-12345678',
    name: 'Gymmi CA',
  },
  bankTransfer: {
    bank: 'Banesco',
    accountNumber: '0134-1234-56-7890123456',
    accountHolder: 'Gymmi CA',
    idNumber: 'J-123456789',
  },
  zinli: { email: 'payments@gymmi.app' },
  binancePay: { payId: '987654321', nickname: 'Gymmi' },
  zelle: { email: 'zelle@gymmi.app', name: 'Gymmi App' },
  exchangeRateBcvNote: 'Tasa BCV oficial del día',
};

const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    userId: 'u1',
    roleName: 'Client',
    plan: 'plus',
    billingCycle: 'monthly',
    amountUsd: 3,
    amountVes: 120,
    paymentMethod: 'pago_movil',
    referenceNumber: 'REF123456',
    originBank: 'Banesco',
    payerPhone: null,
    payerIdNumber: null,
    receiptUrl: null,
    status: 'PENDING',
    rejectionReason: null,
    reviewedById: null,
    reviewedAt: null,
    notes: null,
    createdAt: '2026-09-29T10:00:00.000Z',
    updatedAt: '2026-09-29T10:00:00.000Z',
  },
];

function renderBillingPage() {
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
      createElement(MemoryRouter, null, createElement(BillingPage)),
    ),
  );
}

describe('BillingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (authContext.useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: {
        id: 'u1',
        username: 'testathlete',
        email: 'test@gymmi.app',
        hasPaid: false,
        paidUntil: null,
        role: { id: 'r1', name: 'Client' },
      },
      isAuthenticated: true,
      isLoading: false,
    });

    (userProfileHook.useUserProfile as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
    });

    (paymentsApi.fetchPaymentConfig as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockConfig,
    );
    (paymentsApi.fetchMyPayments as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPayments,
    );
    (paymentsApi.createPayment as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'pay-2',
      status: 'PENDING',
    });
  });

  it('renders page title and free tier subscription status', async () => {
    renderBillingPage();

    expect(await screen.findByText(/Subscription & Billing/i)).toBeInTheDocument();
    expect(screen.getByText(/FREE TIER/i)).toBeInTheDocument();
  });

  it('renders plus active status when user hasPaid is true', async () => {
    (authContext.useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: {
        id: 'u1',
        username: 'plusathlete',
        email: 'plus@gymmi.app',
        hasPaid: true,
        paidUntil: '2026-10-29T12:00:00.000Z',
        role: { id: 'r1', name: 'Client' },
      },
      isAuthenticated: true,
      isLoading: false,
    });

    renderBillingPage();

    expect(await screen.findByText(/PLUS SUBSCRIPTION ACTIVE/i)).toBeInTheDocument();
  });

  it('switches between monthly and annual cadence', async () => {
    renderBillingPage();

    const annualButton = await screen.findByRole('button', { name: /annual/i });
    fireEvent.click(annualButton);

    // Verify annual pricing appears
    expect(screen.getByText(/28/)).toBeInTheDocument();
  });

  it('allows filling reference number and submitting payment form', async () => {
    renderBillingPage();
    await screen.findByText(/Subscription & Billing/i);

    const refInput = screen.getByPlaceholderText(/TxID/i);
    fireEvent.change(refInput, { target: { value: 'PM-998877' } });

    // Submit payment
    const submitBtn = screen.getByRole('button', {
      name: /Submit Payment for Verification/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(paymentsApi.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          referenceNumber: 'PM-998877',
          paymentMethod: 'pago_movil',
          plan: 'plus',
          billingCycle: 'monthly',
        }),
      );
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('displays past payments history table', async () => {
    renderBillingPage();

    expect(await screen.findByText('REF123456')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });
});

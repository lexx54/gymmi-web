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
  exchangeRate: { rate: 889.2553, validFor: '2026-10-30' },
  plans: {
    Client: {
      plus: { monthly: 1.99, annualMonthly: 1.59, monthlyTotal: 1.99, annualTotal: 19.08 },
      pro: { monthly: 2.99, annualMonthly: 2.39, monthlyTotal: 2.99, annualTotal: 28.68 },
    },
  },
};

const FUTURE = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString();
/** Inside the 5-day renewal window. */
const SOON = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

const mockUser = (overrides: Record<string, unknown> = {}) =>
  (authContext.useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    user: {
      id: 'u1',
      username: 'testathlete',
      email: 'test@gymmi.app',
      hasPaid: false,
      paidUntil: null,
      role: { id: 'r1', name: 'Client' },
      ...overrides,
    },
    isAuthenticated: true,
    isLoading: false,
  });

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
    (paymentsApi.fetchMyPayments as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);
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

  it('names the active plan', async () => {
    mockUser({ hasPaid: true, paidUntil: FUTURE, plan: 'pro' });
    renderBillingPage();

    expect(await screen.findByText(/PRO SUBSCRIPTION ACTIVE/i)).toBeInTheDocument();
  });

  it('shows API prices, and annual totals per year', async () => {
    renderBillingPage();
    expect(await screen.findByText('1.99')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /annual/i }));
    expect(screen.getByText('28.68')).toBeInTheDocument();
    expect(screen.getByText('19.08')).toBeInTheDocument();
  });

  it('shows the Bolívar amount at the BCV rate for Pago Móvil', async () => {
    renderBillingPage();

    const amount = await screen.findByTestId('billing-amount');
    expect(amount).toHaveTextContent('Bs. 1.769,62');
    expect(amount).toHaveTextContent('889,2553');
  });

  it('pauses Bolívar methods without a BCV rate but allows USD methods', async () => {
    (paymentsApi.fetchPaymentConfig as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockConfig,
      exchangeRate: null,
    });
    renderBillingPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(/paused/i);
    expect(screen.getByRole('button', { name: /Submit Payment for Verification/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /Zelle/ }));
    expect(screen.getByTestId('billing-amount')).toHaveTextContent('$1.99 USD');
    expect(screen.getByRole('button', { name: /Submit Payment for Verification/i })).toBeEnabled();
  });

  it('only offers payment methods the API has configured', async () => {
    (paymentsApi.fetchPaymentConfig as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockConfig,
      binancePay: undefined,
      zinli: undefined,
    });
    renderBillingPage();

    expect(await screen.findByRole('button', { name: /Zelle/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Binance/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Zinli/ })).not.toBeInTheDocument();
  });

  it('submits the chosen plan without an amount (the API prices it)', async () => {
    renderBillingPage();
    await screen.findByText('1.99');

    fireEvent.change(screen.getByPlaceholderText(/TxID/i), { target: { value: 'PM-998877' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Payment for Verification/i }));

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
    const payload = (paymentsApi.createPayment as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(payload).not.toHaveProperty('amountUsd');
  });

  it('locks plan selection and hides payment until 5 days before the plan ends', async () => {
    mockUser({ hasPaid: true, paidUntil: FUTURE, plan: 'plus' });
    renderBillingPage();

    expect(await screen.findByText(/You can renew or change plans from/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /annual/i })).toBeDisabled();
    expect(screen.queryByText('Selected')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Submit Payment for Verification/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Pago Móvil/i })).not.toBeInTheDocument();
  });

  it('marks the current plan even while plan selection is locked', async () => {
    mockUser({ hasPaid: true, paidUntil: FUTURE, plan: 'plus' });
    renderBillingPage();

    expect(await screen.findByText('Current plan')).toBeInTheDocument();
    const current = document.querySelector('[aria-current="true"]');
    expect(current).toHaveTextContent('Current plan');
    expect(current).toHaveAttribute('aria-disabled', 'true');
  });

  it('opens renewal in the last 5 days of the plan', async () => {
    mockUser({ hasPaid: true, paidUntil: SOON, plan: 'plus' });
    renderBillingPage();

    expect(
      await screen.findByRole('button', { name: /Submit Payment for Verification/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/You can renew or change plans from/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /annual/i })).toBeEnabled();
  });

  it('blocks a smaller plan while a bigger one is active', async () => {
    mockUser({ hasPaid: true, paidUntil: SOON, plan: 'pro' });
    renderBillingPage();

    expect(await screen.findByText('Below your plan')).toBeInTheDocument();
  });

  it('blocks a second submission while one is pending', async () => {
    (paymentsApi.fetchMyPayments as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockPayments);
    renderBillingPage();

    expect(await screen.findByText(/already have a payment under review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Payment for Verification/i })).toBeDisabled();
  });

  it('displays past payments history table', async () => {
    (paymentsApi.fetchMyPayments as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockPayments);
    renderBillingPage();

    expect(await screen.findByText('REF123456')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });
});

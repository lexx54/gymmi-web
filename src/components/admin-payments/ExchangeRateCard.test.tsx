import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExchangeRateCard } from './ExchangeRateCard';
import * as paymentsApi from '../../services/api/payments';
import { caracasToday, parseRateInput } from '../../utils/billing';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../services/api/payments', () => ({
  fetchAdminExchangeRates: vi.fn(),
  setAdminExchangeRate: vi.fn(),
}));

const renderCard = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    createElement(
      QueryClientProvider,
      { client },
      createElement(ExchangeRateCard),
    ),
  );
};

describe('parseRateInput', () => {
  it('accepts dot, comma and BCV-style numbers', () => {
    expect(parseRateInput('481.25')).toBe(481.25);
    expect(parseRateInput('481,25')).toBe(481.25);
    expect(parseRateInput('1.234,5678')).toBe(1234.5678);
    expect(parseRateInput(' 480 ')).toBe(480);
  });

  it('rejects empty, zero and non-numbers', () => {
    expect(parseRateInput('')).toBeNull();
    expect(parseRateInput('0')).toBeNull();
    expect(parseRateInput('abc')).toBeNull();
    expect(parseRateInput('-5')).toBeNull();
  });
});

describe('caracasToday', () => {
  it('uses the Caracas calendar day', () => {
    expect(caracasToday(new Date('2026-10-31T02:00:00Z'))).toBe('2026-10-30');
  });
});

describe('ExchangeRateCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('warns when there is no current rate', async () => {
    vi.mocked(paymentsApi.fetchAdminExchangeRates).mockResolvedValue({
      current: null,
      maxAgeDays: 5,
      history: [],
    });
    renderCard();
    expect(
      await screen.findByText(/Bolívar payments are paused/),
    ).toBeInTheDocument();
  });

  it('submits the parsed rate and date', async () => {
    vi.mocked(paymentsApi.fetchAdminExchangeRates).mockResolvedValue({
      current: { rate: 480, validFor: '2026-11-09' },
      maxAgeDays: 5,
      history: [
        { rate: 480, validFor: '2026-11-09', fetchedAt: '2026-11-09T12:00:00Z' },
      ],
    });
    vi.mocked(paymentsApi.setAdminExchangeRate).mockResolvedValue({
      rate: 481.25,
      validFor: '2026-11-10',
      fetchedAt: '2026-11-10T12:00:00Z',
    });
    renderCard();

    const save = screen.getByRole('button', { name: 'Save rate' });
    expect(save).toBeDisabled();

    fireEvent.change(screen.getByLabelText('VES per 1 USD'), {
      target: { value: '481,25' },
    });
    fireEvent.change(screen.getByLabelText('Valid from (Fecha Valor)'), {
      target: { value: '2026-11-10' },
    });
    fireEvent.click(save);

    await waitFor(() =>
      expect(paymentsApi.setAdminExchangeRate).toHaveBeenCalledWith(
        { rate: 481.25, validFor: '2026-11-10' },
        expect.anything(),
      ),
    );
  });
});

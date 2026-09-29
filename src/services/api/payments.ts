import apiClient from './client';
import type {
  Payment,
  PaginatedPayments,
  PaymentConfig,
  CreatePaymentPayload,
  RejectPaymentPayload,
  PaymentStatus,
} from '../../types/payments';

export async function fetchPaymentConfig(): Promise<PaymentConfig> {
  const { data } = await apiClient.get<PaymentConfig>('/payments/config');
  return data;
}

export async function createPayment(
  payload: CreatePaymentPayload,
): Promise<Payment> {
  const { data } = await apiClient.post<Payment>('/payments', payload);
  return data;
}

export async function fetchMyPayments(): Promise<Payment[]> {
  const { data } = await apiClient.get<Payment[]>('/payments/my');
  return data;
}

export async function fetchAdminPayments(
  page = 1,
  limit = 20,
  status?: PaymentStatus | 'ALL',
): Promise<PaginatedPayments> {
  const params: Record<string, string | number> = { page, limit };
  if (status && status !== 'ALL') {
    params.status = status;
  }
  const { data } = await apiClient.get<PaginatedPayments>('/admin/payments', {
    params,
  });
  return data;
}

export async function approveAdminPayment(id: string): Promise<Payment> {
  const { data } = await apiClient.patch<Payment>(
    `/admin/payments/${id}/approve`,
  );
  return data;
}

export async function rejectAdminPayment(
  id: string,
  payload: RejectPaymentPayload,
): Promise<Payment> {
  const { data } = await apiClient.patch<Payment>(
    `/admin/payments/${id}/reject`,
    payload,
  );
  return data;
}

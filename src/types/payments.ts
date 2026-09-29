export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PaymentMethod =
  | 'pago_movil'
  | 'bank_transfer'
  | 'zinli'
  | 'binance_pay'
  | 'zelle'
  | 'other';

export type BillingCycle = 'monthly' | 'annual';

export interface PaymentUserSummary {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  roleName: string;
}

export interface Payment {
  id: string;
  userId: string;
  user?: PaymentUserSummary;
  roleName: string;
  plan: string;
  billingCycle: BillingCycle;
  amountUsd: number;
  amountVes: number | null;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  originBank: string | null;
  payerPhone: string | null;
  payerIdNumber: string | null;
  receiptUrl: string | null;
  status: PaymentStatus;
  rejectionReason: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPayments {
  items: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface PagoMovilConfig {
  bank: string;
  phone: string;
  idNumber: string;
  name: string;
}

export interface BankTransferConfig {
  bank: string;
  accountNumber: string;
  accountHolder: string;
  idNumber: string;
}

export interface ZinliConfig {
  email: string;
}

export interface BinancePayConfig {
  payId: string;
  nickname: string;
}

export interface ZelleConfig {
  email: string;
  name: string;
}

export interface PaymentConfig {
  pagoMovil: PagoMovilConfig;
  bankTransfer: BankTransferConfig;
  zinli: ZinliConfig;
  binancePay: BinancePayConfig;
  zelle: ZelleConfig;
  exchangeRateBcvNote: string;
}

export interface CreatePaymentPayload {
  plan: string;
  billingCycle: BillingCycle;
  amountUsd: number;
  amountVes?: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  originBank?: string;
  payerPhone?: string;
  payerIdNumber?: string;
  receiptUrl?: string;
  notes?: string;
}

export interface RejectPaymentPayload {
  rejectionReason?: string;
}

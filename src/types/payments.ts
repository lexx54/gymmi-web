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
  userId: string | null;
  user?: PaymentUserSummary;
  roleName: string;
  plan: string;
  billingCycle: BillingCycle;
  amountUsd: number;
  amountVes: number | null;
  /** BCV Bs./USD rate used for `amountVes` (Bolívar methods only). */
  exchangeRate?: number | null;
  exchangeRateDate?: string | null;
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

export interface PlanPrice {
  monthly: number;
  annualMonthly: number;
  /** USD charged for one monthly / one annual payment. */
  monthlyTotal: number;
  annualTotal: number;
}

export interface ExchangeRate {
  /** Bolívares per USD (official BCV rate). */
  rate: number;
  /** BCV "Fecha Valor", YYYY-MM-DD. */
  validFor: string;
}

/**
 * A method is present only when the API has it configured. `exchangeRate`
 * is null while Bolívar payments are paused (no recent BCV rate).
 */
export interface PaymentConfig {
  pagoMovil?: PagoMovilConfig;
  bankTransfer?: BankTransferConfig;
  zinli?: ZinliConfig;
  binancePay?: BinancePayConfig;
  zelle?: ZelleConfig;
  exchangeRateBcvNote: string;
  exchangeRate: ExchangeRate | null;
  /** Prices per role and plan, e.g. `plans.Client.pro.monthlyTotal`. */
  plans: Record<string, Record<string, PlanPrice>>;
}

export interface CreatePaymentPayload {
  plan: string;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  originBank?: string;
  payerPhone?: string;
  payerIdNumber?: string;
  receiptUrl?: string;
  notes?: string;
}

export interface RejectPaymentPayload {
  rejectionReason: string;
}

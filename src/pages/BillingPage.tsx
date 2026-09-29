import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import {
  SettingsPageShell,
  SettingsMain,
  SettingsContent,
  CardSurface,
  SectionLabel,
  SectionTitle,
} from '../components/settings/SettingsShell';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import {
  fetchPaymentConfig,
  fetchMyPayments,
  createPayment,
} from '../services/api/payments';
import { uploadImageDirectly } from '../utils/imageUpload';
import { getApiErrorMessage } from '../services/api/errors';
import { PRICING_DATA } from '../constants/pricing.constants';
import type { BillingCadence } from '../constants/pricing.constants';
import type { PaymentMethod, CreatePaymentPayload } from '../types/payments';

export default function BillingPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: userProfile } = useUserProfile();

  const effectiveUser = userProfile ?? user;
  const username = effectiveUser?.username ?? 'Athlete';
  const roleName = effectiveUser?.role?.name?.toLowerCase() || 'client';
  const roleKey = (
    roleName === 'trainer' ? 'trainer' : roleName === 'gym' ? 'gym' : 'client'
  ) as 'trainer' | 'client' | 'gym';

  // Cadence & Plan Selection state
  const [cadence, setCadence] = useState<BillingCadence>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plus');

  // Payment Method selection
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('pago_movil');

  // Form Fields
  const [referenceNumber, setReferenceNumber] = useState('');
  const [originBank, setOriginBank] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [payerIdNumber, setPayerIdNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Receipt image upload state
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Queries
  const { data: config } = useQuery({
    queryKey: ['payments', 'config'],
    queryFn: fetchPaymentConfig,
  });

  const { data: myPayments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['payments', 'my'],
    queryFn: fetchMyPayments,
  });

  // Check for pending submission
  const pendingPayment = myPayments?.find((p) => p.status === 'PENDING');

  // Current plans for role
  const availablePlans = PRICING_DATA[roleKey] || PRICING_DATA.client;
  const selectedPlan =
    availablePlans.find((p) => p.id === selectedPlanId) ||
    availablePlans.find((p) => p.id === 'plus') ||
    availablePlans[0];

  const priceToPay =
    cadence === 'annual'
      ? selectedPlan.annualPrice * 12
      : selectedPlan.monthlyPrice;

  // Mutation
  const createPaymentMutation = useMutation({
    mutationFn: (payload: CreatePaymentPayload) => createPayment(payload),
    onSuccess: () => {
      toast.success(
        t('billing.paymentSubmitted', 'Payment submitted! We will verify it shortly.'),
      );
      setReferenceNumber('');
      setOriginBank('');
      setPayerPhone('');
      setPayerIdNumber('');
      setNotes('');
      setReceiptUrl(null);
      queryClient.invalidateQueries({ queryKey: ['payments', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('billing.paymentFailed', 'Failed to submit payment.'),
        ),
      );
    },
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(t('billing.copied', 'Copied to clipboard!'));
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingReceipt(true);
      const publicUrl = await uploadImageDirectly(file, 'payment-receipt');
      setReceiptUrl(publicUrl);
      toast.success(t('billing.receiptUploaded', 'Receipt screenshot uploaded!'));
    } catch {
      toast.error(
        t(
          'billing.receiptUploadError',
          'Failed to upload receipt image. Please try again.',
        ),
      );
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) {
      toast.error(t('billing.refRequired', 'Reference number is required.'));
      return;
    }

    createPaymentMutation.mutate({
      plan: selectedPlan.id,
      billingCycle: cadence,
      amountUsd: priceToPay,
      paymentMethod,
      referenceNumber: referenceNumber.trim(),
      originBank: originBank.trim() || undefined,
      payerPhone: payerPhone.trim() || undefined,
      payerIdNumber: payerIdNumber.trim() || undefined,
      receiptUrl: receiptUrl || undefined,
      notes: notes.trim() || undefined,
    });
  };

  // Expiration calculation for active user
  const hasPaid = Boolean(effectiveUser?.hasPaid);
  const [now] = useState(() => Date.now());
  const paidUntilDate = effectiveUser?.paidUntil
    ? new Date(effectiveUser.paidUntil)
    : null;
  const isExpiringSoon =
    paidUntilDate &&
    paidUntilDate.getTime() - now < 5 * 24 * 60 * 60 * 1000;
  const daysRemaining = paidUntilDate
    ? Math.max(
        0,
        Math.ceil(
          (paidUntilDate.getTime() - now) / (24 * 60 * 60 * 1000),
        ),
      )
    : null;

  return (
    <SettingsPageShell>
      <Sidebar username={username} />
      <SettingsMain>
        <TopBar title={t('billing.pageTitle', 'Subscription & Billing')} />

        <SettingsContent>
          {/* SECTION 1: Current Status Card */}
          <CardSurface>
            <StatusHeader>
              <div>
                <SectionLabel>
                  {t('billing.currentPlan', 'CURRENT SUBSCRIPTION')}
                </SectionLabel>
                <StatusTitleRow>
                  <TierBadge $plus={hasPaid}>
                    {hasPaid ? (
                      <>
                        <Sparkles size={16} />
                        <span>
                          {t('billing.plusActive', 'PLUS SUBSCRIPTION ACTIVE')}
                        </span>
                      </>
                    ) : (
                      <>
                        <Shield size={16} />
                        <span>{t('billing.freeTier', 'FREE TIER')}</span>
                      </>
                    )}
                  </TierBadge>
                  {daysRemaining !== null && (
                    <DaysBadge $warning={Boolean(isExpiringSoon)}>
                      <Clock size={14} />
                      <span>
                        {t('billing.daysRemaining', {
                          count: daysRemaining,
                          defaultValue: '{{count}} days remaining',
                        })}
                      </span>
                    </DaysBadge>
                  )}
                </StatusTitleRow>
              </div>

              {hasPaid && paidUntilDate && (
                <ExpirationText>
                  {t('billing.renewsOn', 'Valid until')}:{' '}
                  <strong>{paidUntilDate.toLocaleDateString()}</strong>
                </ExpirationText>
              )}
            </StatusHeader>

            {pendingPayment && (
              <PendingBanner>
                <AlertTriangle size={20} color="#f59e0b" />
                <PendingInfo>
                  <PendingTitle>
                    {t(
                      'billing.pendingTitle',
                      'Payment Verification in Progress',
                    )}
                  </PendingTitle>
                  <PendingSub>
                    {t('billing.pendingDetails', {
                      ref: pendingPayment.referenceNumber,
                      method: (pendingPayment.paymentMethod || '').toUpperCase(),
                      amount: pendingPayment.amountUsd,
                      defaultValue:
                        'Ref #{{ref}} ({{method}} • ${{amount}} USD) submitted on {{date}}. Your plan will update immediately once verified.',
                      date: new Date(
                        pendingPayment.createdAt,
                      ).toLocaleDateString(),
                    })}
                  </PendingSub>
                </PendingInfo>
              </PendingBanner>
            )}
          </CardSurface>

          {/* SECTION 2: Plan & Cadence Switcher */}
          <CardSurface>
            <SectionHeaderRow>
              <div>
                <SectionLabel>
                  {t('billing.choosePlan', 'UPGRADE OR EXTEND')}
                </SectionLabel>
                <SectionTitle>
                  <CreditCard size={20} color="#ef233c" />
                  <span>{t('billing.selectTier', 'Select Plan & Billing Cycle')}</span>
                </SectionTitle>
              </div>

              {/* Monthly vs Annual Toggle */}
              <CadenceSwitchContainer>
                <CadenceButton
                  type="button"
                  $active={cadence === 'monthly'}
                  onClick={() => setCadence('monthly')}
                >
                  {t('landing.pricing.monthly', 'Monthly')}
                </CadenceButton>
                <CadenceButton
                  type="button"
                  $active={cadence === 'annual'}
                  onClick={() => setCadence('annual')}
                >
                  <span>{t('landing.pricing.annual', 'Annual')}</span>
                  <SaveBadge>-20%</SaveBadge>
                </CadenceButton>
              </CadenceSwitchContainer>
            </SectionHeaderRow>

            <PlanCardsGrid>
              {availablePlans
                .filter((p) => p.id !== 'free')
                .map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;
                  const price =
                    cadence === 'annual'
                      ? plan.annualPrice * 12
                      : plan.monthlyPrice;

                  return (
                    <PlanOptionCard
                      key={plan.id}
                      $selected={isSelected}
                      $disabled={plan.disabled}
                      onClick={() => !plan.disabled && setSelectedPlanId(plan.id)}
                    >
                      <PlanHeader>
                        <PlanName>
                          {t(`landing.pricing.${roleKey}.${plan.id}.title`, plan.id.toUpperCase())}
                        </PlanName>
                        {plan.disabled && (
                          <DisabledTag>
                            {t('landing.pricing.comingSoonBadge', 'Coming Soon')}
                          </DisabledTag>
                        )}
                        {isSelected && !plan.disabled && (
                          <SelectedTag>
                            <Check size={12} />
                            <span>{t('common.selected', 'Selected')}</span>
                          </SelectedTag>
                        )}
                      </PlanHeader>

                      <PlanPriceRow>
                        <DollarSign>$</DollarSign>
                        <PriceValue>
                          {Number.isInteger(price) ? price : price.toFixed(2)}
                        </PriceValue>
                        <PriceSuffix>
                          {cadence === 'annual'
                            ? `/${t('billing.year', 'year')}`
                            : `/${t('billing.month', 'month')}`}
                        </PriceSuffix>
                      </PlanPriceRow>

                      <FeaturesList>
                        {plan.features.map((feat, idx) => (
                          <FeatureItem key={idx}>
                            <CheckCircle2
                              size={15}
                              color={feat.included ? '#34d399' : '#64748b'}
                            />
                            <FeatureText $included={feat.included}>
                              {t(feat.textKey, feat.textKey)}
                            </FeatureText>
                          </FeatureItem>
                        ))}
                      </FeaturesList>
                    </PlanOptionCard>
                  );
                })}
            </PlanCardsGrid>
          </CardSurface>

          {/* SECTION 3: Payment Destination Coordinates */}
          <CardSurface>
            <SectionLabel>{t('billing.step2', 'STEP 2: PAYMENT COORDINATES')}</SectionLabel>
            <SectionTitle>
              {t('billing.transferInstructions', 'Send Payment to Our Official Accounts')}
            </SectionTitle>

            <MethodTabsRow>
              <MethodTab
                type="button"
                $active={paymentMethod === 'pago_movil'}
                onClick={() => setPaymentMethod('pago_movil')}
              >
                🇻🇪 Pago Móvil
              </MethodTab>
              <MethodTab
                type="button"
                $active={paymentMethod === 'bank_transfer'}
                onClick={() => setPaymentMethod('bank_transfer')}
              >
                🏦 Transferencia
              </MethodTab>
              <MethodTab
                type="button"
                $active={paymentMethod === 'binance_pay'}
                onClick={() => setPaymentMethod('binance_pay')}
              >
                🟡 Binance Pay (USDT)
              </MethodTab>
              <MethodTab
                type="button"
                $active={paymentMethod === 'zinli'}
                onClick={() => setPaymentMethod('zinli')}
              >
                🟣 Zinli
              </MethodTab>
              <MethodTab
                type="button"
                $active={paymentMethod === 'zelle'}
                onClick={() => setPaymentMethod('zelle')}
              >
                💵 Zelle
              </MethodTab>
            </MethodTabsRow>

            {/* Coordinates Display */}
            <CoordinatesCard>
              {paymentMethod === 'pago_movil' && config?.pagoMovil && (
                <>
                  <CoordinateRow>
                    <CoordLabel>{t('billing.bank', 'Banco')}:</CoordLabel>
                    <CoordValue>{config.pagoMovil.bank}</CoordValue>
                    <CopyButton
                      type="button"
                      onClick={() => handleCopy(config.pagoMovil.bank, 'pm-bank')}
                    >
                      {copiedKey === 'pm-bank' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    </CopyButton>
                  </CoordinateRow>
                  <CoordinateRow>
                    <CoordLabel>{t('billing.phone', 'Teléfono')}:</CoordLabel>
                    <CoordValue>{config.pagoMovil.phone}</CoordValue>
                    <CopyButton
                      type="button"
                      onClick={() => handleCopy(config.pagoMovil.phone, 'pm-phone')}
                    >
                      {copiedKey === 'pm-phone' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    </CopyButton>
                  </CoordinateRow>
                  <CoordinateRow>
                    <CoordLabel>{t('billing.idNumber', 'C.I. / RIF')}:</CoordLabel>
                    <CoordValue>{config.pagoMovil.idNumber}</CoordValue>
                    <CopyButton
                      type="button"
                      onClick={() => handleCopy(config.pagoMovil.idNumber, 'pm-id')}
                    >
                      {copiedKey === 'pm-id' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    </CopyButton>
                  </CoordinateRow>
                  <CoordinateRow>
                    <CoordLabel>{t('billing.accountHolder', 'Titular')}:</CoordLabel>
                    <CoordValue>{config.pagoMovil.name}</CoordValue>
                  </CoordinateRow>
                  <BcvNote>
                    💡 {config.exchangeRateBcvNote}
                  </BcvNote>
                </>
              )}

              {paymentMethod === 'bank_transfer' && config?.bankTransfer && (
                <>
                  <CoordinateRow>
                    <CoordLabel>{t('billing.bank', 'Banco')}:</CoordLabel>
                    <CoordValue>{config.bankTransfer.bank}</CoordValue>
                  </CoordinateRow>
                  <CoordinateRow>
                    <CoordLabel>{t('billing.accountNumber', 'Cuenta')}:</CoordLabel>
                    <CoordValue>{config.bankTransfer.accountNumber}</CoordValue>
                    <CopyButton
                      type="button"
                      onClick={() => handleCopy(config.bankTransfer.accountNumber, 'bt-acc')}
                    >
                      {copiedKey === 'bt-acc' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    </CopyButton>
                  </CoordinateRow>
                  <CoordinateRow>
                    <CoordLabel>{t('billing.accountHolder', 'Titular')}:</CoordLabel>
                    <CoordValue>{config.bankTransfer.accountHolder}</CoordValue>
                  </CoordinateRow>
                  <CoordinateRow>
                    <CoordLabel>{t('billing.idNumber', 'RIF')}:</CoordLabel>
                    <CoordValue>{config.bankTransfer.idNumber}</CoordValue>
                  </CoordinateRow>
                </>
              )}

              {paymentMethod === 'binance_pay' && config?.binancePay && (
                <>
                  <CoordinateRow>
                    <CoordLabel>Binance Pay ID:</CoordLabel>
                    <CoordValue>{config.binancePay.payId}</CoordValue>
                    <CopyButton
                      type="button"
                      onClick={() => handleCopy(config.binancePay.payId, 'bin-id')}
                    >
                      {copiedKey === 'bin-id' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    </CopyButton>
                  </CoordinateRow>
                  <CoordinateRow>
                    <CoordLabel>{t('billing.accountHolder', 'Nickname')}:</CoordLabel>
                    <CoordValue>{config.binancePay.nickname}</CoordValue>
                  </CoordinateRow>
                </>
              )}

              {paymentMethod === 'zinli' && config?.zinli && (
                <CoordinateRow>
                  <CoordLabel>Zinli Email:</CoordLabel>
                  <CoordValue>{config.zinli.email}</CoordValue>
                  <CopyButton
                    type="button"
                    onClick={() => handleCopy(config.zinli.email, 'zinli')}
                  >
                    {copiedKey === 'zinli' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                  </CopyButton>
                </CoordinateRow>
              )}

              {paymentMethod === 'zelle' && config?.zelle && (
                <>
                  <CoordinateRow>
                    <CoordLabel>Zelle Email:</CoordLabel>
                    <CoordValue>{config.zelle.email}</CoordValue>
                    <CopyButton
                      type="button"
                      onClick={() => handleCopy(config.zelle.email, 'zelle')}
                    >
                      {copiedKey === 'zelle' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    </CopyButton>
                  </CoordinateRow>
                  <CoordinateRow>
                    <CoordLabel>{t('billing.accountHolder', 'Recipient Name')}:</CoordLabel>
                    <CoordValue>{config.zelle.name}</CoordValue>
                  </CoordinateRow>
                </>
              )}
            </CoordinatesCard>
          </CardSurface>

          {/* SECTION 4: Submission Form */}
          <CardSurface>
            <SectionLabel>{t('billing.step3', 'STEP 3: SUBMIT REFERENCE')}</SectionLabel>
            <SectionTitle>
              {t('billing.reportPayment', 'Submit Payment for Verification')}
            </SectionTitle>

            <FormWrapper onSubmit={handleSubmit}>
              <FormGrid>
                <FormGroup>
                  <FormLabel>
                    {t('billing.referenceNumber', 'Reference Number')} *
                  </FormLabel>
                  <FormInput
                    type="text"
                    required
                    placeholder={t('billing.refPlaceholder', 'e.g. 04819204 or TxID')}
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>
                    {t('billing.originBank', 'Bank of Origin / Wallet')}
                  </FormLabel>
                  <FormInput
                    type="text"
                    placeholder={t('billing.bankPlaceholder', 'e.g. Banesco, BDV, Binance')}
                    value={originBank}
                    onChange={(e) => setOriginBank(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>
                    {t('billing.payerPhone', 'Payer Phone (for Pago Móvil)')}
                  </FormLabel>
                  <FormInput
                    type="text"
                    placeholder="e.g. 04141234567"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>
                    {t('billing.payerId', 'Payer ID / C.I.')}
                  </FormLabel>
                  <FormInput
                    type="text"
                    placeholder="e.g. V-12345678"
                    value={payerIdNumber}
                    onChange={(e) => setPayerIdNumber(e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              {/* Receipt Image Dropzone */}
              <ReceiptSection>
                <FormLabel>{t('billing.receiptScreenshot', 'Payment Receipt Screenshot (Optional)')}</FormLabel>
                {receiptUrl ? (
                  <ReceiptPreviewBox>
                    <ReceiptImg src={receiptUrl} alt="Receipt preview" />
                    <ReceiptMeta>
                      <FileCheck size={18} color="#34d399" />
                      <span>{t('billing.receiptAttached', 'Receipt attached successfully')}</span>
                      <RemoveButton type="button" onClick={() => setReceiptUrl(null)}>
                        {t('common.remove', 'Remove')}
                      </RemoveButton>
                    </ReceiptMeta>
                  </ReceiptPreviewBox>
                ) : (
                  <DropzoneLabel>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={handleReceiptUpload}
                      disabled={isUploadingReceipt}
                    />
                    <UploadCloud size={28} color="#94a3b8" />
                    <span>
                      {isUploadingReceipt
                        ? t('common.uploading', 'Uploading...')
                        : t('billing.uploadPrompt', 'Click or drag screenshot of payment confirmation')}
                    </span>
                  </DropzoneLabel>
                )}
              </ReceiptSection>

              <FormGroup>
                <FormLabel>{t('billing.notes', 'Notes / Observations')}</FormLabel>
                <FormInput
                  type="text"
                  placeholder={t('billing.notesPlaceholder', 'Any additional details for the verification team...')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </FormGroup>

              <SubmitButton
                type="submit"
                disabled={createPaymentMutation.isPending || isUploadingReceipt}
              >
                <span>
                  {createPaymentMutation.isPending
                    ? t('common.submitting', 'Submitting...')
                    : t('billing.submitBtn', 'Confirm and Submit Payment')}
                </span>
                <ArrowRight size={18} />
              </SubmitButton>
            </FormWrapper>
          </CardSurface>

          {/* SECTION 5: My Payment History */}
          <CardSurface>
            <SectionLabel>{t('billing.historyLabel', 'RECORDS')}</SectionLabel>
            <SectionTitle>
              {t('billing.paymentHistory', 'Your Payment History')}
            </SectionTitle>

            {isLoadingPayments ? (
              <LoadingText>{t('common.loading', 'Loading...')}</LoadingText>
            ) : myPayments && myPayments.length > 0 ? (
              <HistoryTable>
                <thead>
                  <tr>
                    <Th>{t('billing.date', 'Date')}</Th>
                    <Th>{t('billing.plan', 'Plan')}</Th>
                    <Th>{t('billing.method', 'Method')}</Th>
                    <Th>{t('billing.ref', 'Reference #')}</Th>
                    <Th>{t('billing.amount', 'Amount')}</Th>
                    <Th>{t('billing.status', 'Status')}</Th>
                  </tr>
                </thead>
                <tbody>
                  {myPayments.map((p) => (
                    <tr key={p.id}>
                      <Td>{new Date(p.createdAt).toLocaleDateString()}</Td>
                      <Td>
                        {p.plan.toUpperCase()} • {p.billingCycle}
                      </Td>
                      <Td>{p.paymentMethod.replace('_', ' ').toUpperCase()}</Td>
                      <Td>{p.referenceNumber}</Td>
                      <Td>${p.amountUsd} USD</Td>
                      <Td>
                        <StatusPill $status={p.status}>
                          {p.status === 'APPROVED' && <CheckCircle2 size={12} />}
                          {p.status === 'PENDING' && <Clock size={12} />}
                          {p.status === 'REJECTED' && <XCircle size={12} />}
                          <span>{p.status}</span>
                        </StatusPill>
                        {p.rejectionReason && (
                          <RejectionNote>
                            {p.rejectionReason}
                          </RejectionNote>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </HistoryTable>
            ) : (
              <EmptyHistoryNote>
                {t('billing.noHistory', 'No payment records found yet.')}
              </EmptyHistoryNote>
            )}
          </CardSurface>
        </SettingsContent>
      </SettingsMain>
    </SettingsPageShell>
  );
}

/* Styled Components */


const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StatusTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.35rem;
  flex-wrap: wrap;
`;

const TierBadge = styled.div<{ $plus: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: ${({ $plus }) =>
    $plus ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 255, 255, 0.06)'};
  color: ${({ $plus }) => ($plus ? '#34d399' : '#cbd5e1')};
  border: 1px solid
    ${({ $plus }) => ($plus ? 'rgba(52, 211, 153, 0.4)' : 'rgba(255, 255, 255, 0.12)')};
`;

const DaysBadge = styled.div<{ $warning?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  background: ${({ $warning }) =>
    $warning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.12)'};
  color: ${({ $warning }) => ($warning ? '#f59e0b' : '#60a5fa')};
  border: 1px solid
    ${({ $warning }) =>
      $warning ? 'rgba(245, 158, 11, 0.4)' : 'rgba(59, 130, 246, 0.25)'};
`;

const ExpirationText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #94a3b8;
  strong {
    color: #f1f5f9;
  }
`;

const PendingBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  margin-top: 1rem;
  border-radius: 0.75rem;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.3);
`;

const PendingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PendingTitle = styled.h4`
  margin: 0;
  color: #fbbf24;
  font-size: 0.95rem;
  font-weight: 700;
`;

const PendingSub = styled.p`
  margin: 0;
  color: #cbd5e1;
  font-size: 0.8125rem;
  line-height: 1.5;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const CadenceSwitchContainer = styled.div`
  display: inline-flex;
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  gap: 0.25rem;
`;

const CadenceButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: none;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  background: ${({ $active }) => ($active ? '#ef233c' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#94a3b8')};
  transition: all 0.2s ease;
`;

const SaveBadge = styled.span`
  background: #34d399;
  color: #0b1120;
  font-size: 0.625rem;
  font-weight: 800;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
`;

const PlanCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
`;

const PlanOptionCard = styled.div<{ $selected: boolean; $disabled?: boolean }>`
  padding: 1.25rem;
  border-radius: 1rem;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  background: ${({ $selected }) =>
    $selected ? 'rgba(239, 35, 60, 0.08)' : 'rgba(255, 255, 255, 0.03)'};
  border: 2px solid
    ${({ $selected }) => ($selected ? '#ef233c' : 'rgba(255, 255, 255, 0.08)')};
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &:hover {
    border-color: ${({ $selected, $disabled }) =>
      $disabled ? 'rgba(255, 255, 255, 0.08)' : $selected ? '#ef233c' : 'rgba(255, 255, 255, 0.25)'};
  }
`;

const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlanName = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
`;

const SelectedTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 800;
  color: #ef233c;
  background: rgba(239, 35, 60, 0.15);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

const DisabledTag = styled.div`
  font-size: 0.6875rem;
  font-weight: 800;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

const PlanPriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
`;

const DollarSign = styled.span`
  font-size: 1.15rem;
  font-weight: 700;
  color: #cbd5e1;
`;

const PriceValue = styled.span`
  font-size: 2rem;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
`;

const PriceSuffix = styled.span`
  font-size: 0.8125rem;
  color: #94a3b8;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 0.75rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FeatureText = styled.span<{ $included: boolean }>`
  font-size: 0.8125rem;
  color: ${({ $included }) => ($included ? '#cbd5e1' : '#64748b')};
`;

const MethodTabsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const MethodTab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid
    ${({ $active }) => ($active ? '#ef233c' : 'rgba(255, 255, 255, 0.1)')};
  background: ${({ $active }) =>
    $active ? 'rgba(239, 35, 60, 0.15)' : 'rgba(255, 255, 255, 0.04)'};
  color: ${({ $active }) => ($active ? '#ffffff' : '#94a3b8')};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CoordinatesCard = styled.div`
  margin-top: 1rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  background: #0f1220;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CoordinateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
`;

const CoordLabel = styled.span`
  color: #94a3b8;
  font-weight: 600;
  min-width: 90px;
`;

const CoordValue = styled.span`
  color: #ffffff;
  font-weight: 700;
  font-family: monospace;
  font-size: 0.95rem;
`;

const CopyButton = styled.button`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  color: #cbd5e1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
`;

const BcvNote = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
  color: #f59e0b;
  line-height: 1.5;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const FormLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #94a3b8;
  text-transform: uppercase;
`;

const FormInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #0f1220;
  color: #ffffff;
  font-size: 0.9rem;
  outline: none;

  &:focus {
    border-color: #ef233c;
  }
`;

const ReceiptSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DropzoneLabel = styled.label`
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #94a3b8;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ef233c;
    color: #f1f5f9;
  }
`;

const ReceiptPreviewBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
`;

const ReceiptImg = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const ReceiptMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  color: #cbd5e1;
  font-size: 0.85rem;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #f87171;
  font-size: 0.75rem;
  cursor: pointer;
  margin-left: auto;
  text-decoration: underline;
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.75rem;
  border-radius: 0.75rem;
  background: #ef233c;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #d90429;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  font-size: 0.75rem;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: #f1f5f9;
`;

const StatusPill = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 800;
  color: ${({ $status }) =>
    $status === 'APPROVED' ? '#34d399' : $status === 'PENDING' ? '#f59e0b' : '#f87171'};
  background: ${({ $status }) =>
    $status === 'APPROVED'
      ? 'rgba(52, 211, 153, 0.12)'
      : $status === 'PENDING'
      ? 'rgba(245, 158, 11, 0.12)'
      : 'rgba(239, 68, 68, 0.12)'};
`;

const RejectionNote = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.6875rem;
  color: #f87171;
`;

const LoadingText = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const EmptyHistoryNote = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

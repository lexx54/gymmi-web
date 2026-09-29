import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Check,
  X,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import {
  ExercisesPageShell,
  ExercisesMain,
  ExercisesContent,
} from '../../components/exercises/ExercisesShell';
import { TopBar } from '../../components/layout/TopBar';
import {
  fetchAdminPayments,
  approveAdminPayment,
  rejectAdminPayment,
} from '../../services/api/payments';
import { getApiErrorMessage } from '../../services/api/errors';
import type { Payment, PaymentStatus } from '../../types/payments';

export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const username = user?.username ?? 'Admin';

  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'ALL'>('PENDING');

  // Modals state
  const [inspectReceiptUrl, setInspectReceiptUrl] = useState<string | null>(null);
  const [paymentToApprove, setPaymentToApprove] = useState<Payment | null>(null);
  const [paymentToReject, setPaymentToReject] = useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ['admin', 'payments', page, filterStatus],
    queryFn: () => fetchAdminPayments(page, 20, filterStatus),
  });

  const approveMutation = useMutation({
    mutationFn: (paymentId: string) => approveAdminPayment(paymentId),
    onSuccess: () => {
      toast.success(t('admin.payments.approvedToast', 'Payment approved and Plus activated!'));
      setPaymentToApprove(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('admin.payments.approveFailed', 'Failed to approve payment.'),
        ),
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (vars: { paymentId: string; reason: string }) =>
      rejectAdminPayment(vars.paymentId, { rejectionReason: vars.reason }),
    onSuccess: () => {
      toast.success(t('admin.payments.rejectedToast', 'Payment marked as rejected.'));
      setPaymentToReject(null);
      setRejectionReason('');
      queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('admin.payments.rejectFailed', 'Failed to reject payment.'),
        ),
      );
    },
  });

  const totalPages = paymentsData
    ? Math.ceil(paymentsData.total / paymentsData.limit)
    : 1;

  return (
    <ExercisesPageShell>
      <Sidebar username={username} />
      <ExercisesMain>
        <TopBar
          title={t('admin.payments.pageTitle', 'Payment Verifications')}
        />
        <ExercisesContent>
          {/* Status Filter Tabs */}
          <FilterRow>
            <FilterTab
              type="button"
              $active={filterStatus === 'PENDING'}
              onClick={() => {
                setFilterStatus('PENDING');
                setPage(1);
              }}
            >
              <Clock size={15} />
              <span>{t('admin.payments.pendingTab', 'Pending Review')}</span>
            </FilterTab>
            <FilterTab
              type="button"
              $active={filterStatus === 'APPROVED'}
              onClick={() => {
                setFilterStatus('APPROVED');
                setPage(1);
              }}
            >
              <CheckCircle2 size={15} />
              <span>{t('admin.payments.approvedTab', 'Approved')}</span>
            </FilterTab>
            <FilterTab
              type="button"
              $active={filterStatus === 'REJECTED'}
              onClick={() => {
                setFilterStatus('REJECTED');
                setPage(1);
              }}
            >
              <XCircle size={15} />
              <span>{t('admin.payments.rejectedTab', 'Rejected')}</span>
            </FilterTab>
            <FilterTab
              type="button"
              $active={filterStatus === 'ALL'}
              onClick={() => {
                setFilterStatus('ALL');
                setPage(1);
              }}
            >
              <span>{t('common.all', 'All')}</span>
            </FilterTab>
          </FilterRow>

          <CardContainer>
            {isLoading ? (
              <LoadingText>{t('common.loading', 'Loading payments...')}</LoadingText>
            ) : !paymentsData?.items.length ? (
              <EmptyText>
                {t('admin.payments.noSubmissions', 'No payment records in this category.')}
              </EmptyText>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>{t('admin.payments.user', 'User')}</Th>
                    <Th>{t('admin.payments.plan', 'Plan')}</Th>
                    <Th>{t('admin.payments.method', 'Method')}</Th>
                    <Th>{t('admin.payments.reference', 'Reference #')}</Th>
                    <Th>{t('admin.payments.amount', 'Amount')}</Th>
                    <Th>{t('admin.payments.receipt', 'Receipt')}</Th>
                    <Th>{t('admin.payments.status', 'Status')}</Th>
                    <Th>{t('admin.payments.actions', 'Actions')}</Th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsData.items.map((item) => (
                    <tr key={item.id}>
                      <Td>
                        <UserCell>
                          <Avatar>{item.user?.username?.slice(0, 2).toUpperCase() || 'U'}</Avatar>
                          <UserInfo>
                            <UserName>{item.user?.username || 'Unknown'}</UserName>
                            <UserEmail>{item.user?.email}</UserEmail>
                            <RoleBadge>
                              <Shield size={10} />
                              <span>{item.user?.roleName || item.roleName}</span>
                            </RoleBadge>
                          </UserInfo>
                        </UserCell>
                      </Td>
                      <Td>
                        <PlanBadge>
                          {item.plan.toUpperCase()} • {item.billingCycle}
                        </PlanBadge>
                      </Td>
                      <Td>
                        <MethodBadge>
                          {item.paymentMethod.replace('_', ' ').toUpperCase()}
                        </MethodBadge>
                      </Td>
                      <Td>
                        <ReferenceText>{item.referenceNumber}</ReferenceText>
                        {item.originBank && (
                          <SubMeta>{item.originBank}</SubMeta>
                        )}
                        {item.payerPhone && (
                          <SubMeta>{item.payerPhone}</SubMeta>
                        )}
                        {item.payerIdNumber && (
                          <SubMeta>{item.payerIdNumber}</SubMeta>
                        )}
                      </Td>
                      <Td>
                        <AmountText>${item.amountUsd} USD</AmountText>
                        {item.amountVes && (
                          <SubMeta>Bs. {item.amountVes}</SubMeta>
                        )}
                      </Td>
                      <Td>
                        {item.receiptUrl ? (
                          <ReceiptThumbnailButton
                            type="button"
                            onClick={() => setInspectReceiptUrl(item.receiptUrl!)}
                          >
                            <ReceiptThumbnail
                              src={item.receiptUrl}
                              alt="Receipt"
                            />
                            <Eye size={12} />
                          </ReceiptThumbnailButton>
                        ) : (
                          <SubMeta>None</SubMeta>
                        )}
                      </Td>
                      <Td>
                        <StatusPill $status={item.status}>
                          {item.status}
                        </StatusPill>
                        {item.rejectionReason && (
                          <ReasonText>{item.rejectionReason}</ReasonText>
                        )}
                      </Td>
                      <Td>
                        {item.status === 'PENDING' ? (
                          <ActionButtonsRow>
                            <ApproveButton
                              type="button"
                              title="Approve Payment"
                              onClick={() => setPaymentToApprove(item)}
                            >
                              <Check size={16} />
                            </ApproveButton>
                            <RejectButton
                              type="button"
                              title="Reject Payment"
                              onClick={() => setPaymentToReject(item)}
                            >
                              <X size={16} />
                            </RejectButton>
                          </ActionButtonsRow>
                        ) : (
                          <SubMeta>
                            {item.reviewedAt
                              ? new Date(item.reviewedAt).toLocaleDateString()
                              : '—'}
                          </SubMeta>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationRow>
                <PageButton
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  {t('common.prev', 'Previous')}
                </PageButton>
                <PageInfo>
                  {t('admin.pageOf', { page, total: totalPages })}
                </PageInfo>
                <PageButton
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t('common.next', 'Next')}
                </PageButton>
              </PaginationRow>
            )}
          </CardContainer>

          {/* Modal 1: Receipt Image Zoom Modal */}
          {inspectReceiptUrl && (
            <ModalOverlay onClick={() => setInspectReceiptUrl(null)}>
              <ModalCard onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>
                    {t('admin.payments.inspectReceipt', 'Receipt Proof')}
                  </ModalTitle>
                  <CloseModalBtn
                    type="button"
                    onClick={() => setInspectReceiptUrl(null)}
                  >
                    <X size={18} />
                  </CloseModalBtn>
                </ModalHeader>
                <FullReceiptImg
                  src={inspectReceiptUrl}
                  alt="Full receipt screenshot"
                />
                <ModalFooter>
                  <ReceiptLink
                    href={inspectReceiptUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{t('admin.payments.openOriginal', 'Open original')}</span>
                    <ExternalLink size={14} />
                  </ReceiptLink>
                </ModalFooter>
              </ModalCard>
            </ModalOverlay>
          )}

          {/* Modal 2: Approve Confirmation Modal */}
          {paymentToApprove && (
            <ModalOverlay onClick={() => setPaymentToApprove(null)}>
              <ModalCard onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>
                    {t('admin.payments.confirmApprove', 'Confirm Payment Approval')}
                  </ModalTitle>
                  <CloseModalBtn
                    type="button"
                    onClick={() => setPaymentToApprove(null)}
                  >
                    <X size={18} />
                  </CloseModalBtn>
                </ModalHeader>
                <ModalBody>
                  <p>
                    Are you sure you want to approve this payment of{' '}
                    <strong>${paymentToApprove.amountUsd} USD</strong> for user{' '}
                    <strong>{paymentToApprove.user?.username}</strong>?
                  </p>
                  <ApprovalSummaryBox>
                    <SummaryRow>
                      <span>Plan:</span>
                      <strong>
                        {paymentToApprove.plan.toUpperCase()} (
                        {paymentToApprove.billingCycle})
                      </strong>
                    </SummaryRow>
                    <SummaryRow>
                      <span>Reference:</span>
                      <strong>{paymentToApprove.referenceNumber}</strong>
                    </SummaryRow>
                    <SummaryRow>
                      <span>New Subscription Period:</span>
                      <strong style={{ color: '#34d399' }}>
                        +{paymentToApprove.billingCycle === 'annual' ? 365 : 30}{' '}
                        days from today (or stacks on active subscription)
                      </strong>
                    </SummaryRow>
                  </ApprovalSummaryBox>
                </ModalBody>
                <ModalFooter>
                  <CancelButton
                    type="button"
                    onClick={() => setPaymentToApprove(null)}
                  >
                    {t('common.cancel', 'Cancel')}
                  </CancelButton>
                  <ConfirmApproveBtn
                    type="button"
                    disabled={approveMutation.isPending}
                    onClick={() =>
                      approveMutation.mutate(paymentToApprove.id)
                    }
                  >
                    {approveMutation.isPending
                      ? t('common.approving', 'Approving...')
                      : t('admin.payments.approveBtn', 'Confirm & Activate Plus')}
                  </ConfirmApproveBtn>
                </ModalFooter>
              </ModalCard>
            </ModalOverlay>
          )}

          {/* Modal 3: Reject Dialog Modal */}
          {paymentToReject && (
            <ModalOverlay onClick={() => setPaymentToReject(null)}>
              <ModalCard onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>
                    {t('admin.payments.confirmReject', 'Reject Payment')}
                  </ModalTitle>
                  <CloseModalBtn
                    type="button"
                    onClick={() => setPaymentToReject(null)}
                  >
                    <X size={18} />
                  </CloseModalBtn>
                </ModalHeader>
                <ModalBody>
                  <p>
                    Please specify why this payment reference could not be
                    verified:
                  </p>
                  <RejectInput
                    required
                    placeholder="e.g. Reference number not found on bank statement"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter>
                  <CancelButton
                    type="button"
                    onClick={() => setPaymentToReject(null)}
                  >
                    {t('common.cancel', 'Cancel')}
                  </CancelButton>
                  <ConfirmRejectBtn
                    type="button"
                    disabled={rejectMutation.isPending}
                    onClick={() =>
                      rejectMutation.mutate({
                        paymentId: paymentToReject.id,
                        reason: rejectionReason,
                      })
                    }
                  >
                    {rejectMutation.isPending
                      ? t('common.rejecting', 'Rejecting...')
                      : t('admin.payments.rejectBtn', 'Reject Payment')}
                  </ConfirmRejectBtn>
                </ModalFooter>
              </ModalCard>
            </ModalOverlay>
          )}
        </ExercisesContent>
      </ExercisesMain>
    </ExercisesPageShell>
  );
}

/* Styled Components */

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FilterTab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid
    ${({ $active }) => ($active ? '#ef233c' : 'rgba(255, 255, 255, 0.1)')};
  background: ${({ $active }) =>
    $active ? 'rgba(239, 35, 60, 0.15)' : 'rgba(255, 255, 255, 0.04)'};
  color: ${({ $active }) => ($active ? '#ffffff' : '#94a3b8')};
  transition: all 0.2s ease;
`;

const CardContainer = styled.div`
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #0f1220;
  padding: 1.5rem;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.875rem 0.75rem;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const Td = styled.td`
  padding: 1rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  vertical-align: middle;
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #1e293b;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const UserName = styled.span`
  color: #ffffff;
  font-weight: 700;
`;

const UserEmail = styled.span`
  color: #94a3b8;
  font-size: 0.75rem;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.65rem;
  color: #60a5fa;
  font-weight: 700;
`;

const PlanBadge = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 800;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
`;

const MethodBadge = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  color: #a855f7;
  background: rgba(168, 85, 247, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.25);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

const ReferenceText = styled.span`
  color: #ffffff;
  font-family: monospace;
  font-weight: 700;
  display: block;
`;

const SubMeta = styled.span`
  color: #94a3b8;
  font-size: 0.75rem;
  display: block;
`;

const AmountText = styled.span`
  color: #ffffff;
  font-weight: 800;
  display: block;
`;

const ReceiptThumbnailButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
`;

const ReceiptThumbnail = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
  border-radius: 4px;
`;

const StatusPill = styled.span<{ $status: string }>`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  color: ${({ $status }) =>
    $status === 'APPROVED' ? '#34d399' : $status === 'PENDING' ? '#f59e0b' : '#f87171'};
  background: ${({ $status }) =>
    $status === 'APPROVED'
      ? 'rgba(52, 211, 153, 0.12)'
      : $status === 'PENDING'
      ? 'rgba(245, 158, 11, 0.12)'
      : 'rgba(239, 68, 68, 0.12)'};
`;

const ReasonText = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.6875rem;
  color: #f87171;
  max-width: 140px;
`;

const ActionButtonsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ApproveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #34d399;
    color: #0b1120;
  }
`;

const RejectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    color: #ffffff;
  }
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
`;

const PageButton = styled.button`
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  font-size: 0.8125rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #94a3b8;
  font-size: 0.8125rem;
`;

const LoadingText = styled.p`
  color: #94a3b8;
  text-align: center;
  padding: 2rem;
`;

const EmptyText = styled.p`
  color: #64748b;
  text-align: center;
  padding: 2rem;
`;

/* Modals */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const ModalCard = styled.div`
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.25rem;
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 800;
`;

const CloseModalBtn = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;

  &:hover {
    color: #ffffff;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
`;

const FullReceiptImg = styled.img`
  max-height: 480px;
  width: 100%;
  object-fit: contain;
  background: #000000;
`;

const ReceiptLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #60a5fa;
  font-size: 0.85rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ApprovalSummaryBox = styled.div`
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.85rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  span {
    color: #94a3b8;
  }
  strong {
    color: #ffffff;
  }
`;

const RejectInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #0f1220;
  color: #ffffff;
  font-size: 0.9rem;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #ef4444;
  }
`;

const CancelButton = styled.button`
  padding: 0.6rem 1.1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
`;

const ConfirmApproveBtn = styled.button`
  padding: 0.6rem 1.25rem;
  border-radius: 0.625rem;
  border: none;
  background: #10b981;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConfirmRejectBtn = styled.button`
  padding: 0.6rem 1.25rem;
  border-radius: 0.625rem;
  border: none;
  background: #ef4444;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AlertTriangle, Ban, Check, Trash2 } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import {
  ExercisesPageShell,
  ExercisesMain,
  ExercisesContent,
} from '../../components/exercises/ExercisesShell';
import { TopBar } from '../../components/layout/TopBar';
import { useAdminReports, useResolveReport } from '../../hooks/useModeration';
import { getApiErrorMessage } from '../../services/api/errors';
import type {
  AdminReport,
  ReportStatus,
  ResolveReportPayload,
} from '../../types/moderation';

const STATUS_FILTERS: Array<ReportStatus | 'ALL'> = [
  'OPEN',
  'ACTION_TAKEN',
  'DISMISSED',
  'ALL',
];

/** Reports older than this are past the 24-hour review promise in the Terms. */
const REVIEW_SLA_MS = 24 * 60 * 60 * 1000;

export default function AdminReportsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const username = user?.username ?? 'Admin';

  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'ALL'>('OPEN');

  const { data, isLoading } = useAdminReports(page, filterStatus);
  const resolveMutation = useResolveReport();

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  const resolve = async (report: AdminReport, payload: ResolveReportPayload) => {
    if (
      payload.deactivateUser &&
      !window.confirm(
        t('admin.reports.confirmDeactivate', {
          username: report.targetUser?.username ?? '',
        }),
      )
    ) {
      return;
    }
    try {
      await resolveMutation.mutateAsync({ id: report.id, payload });
      toast.success(t('admin.reports.resolved'));
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('admin.reports.resolveFailed')));
    }
  };

  return (
    <ExercisesPageShell>
      <Sidebar username={username} />
      <ExercisesMain>
        <TopBar title={t('admin.reports.title')} />
        <ExercisesContent>
          <Description>{t('admin.reports.desc')}</Description>

          <FilterRow>
            {STATUS_FILTERS.map((status) => (
              <FilterTab
                key={status}
                type="button"
                $active={filterStatus === status}
                onClick={() => {
                  setFilterStatus(status);
                  setPage(1);
                }}
                data-testid={`reports-filter-${status}`}
              >
                {t(`admin.reports.statuses.${status}`)}
              </FilterTab>
            ))}
          </FilterRow>

          {isLoading && <MutedText>{t('common.loading')}</MutedText>}

          {!isLoading && (data?.items.length ?? 0) === 0 && (
            <MutedText data-testid="reports-empty">{t('admin.reports.empty')}</MutedText>
          )}

          <List>
            {data?.items.map((report) => {
              const isOpen = report.status === 'OPEN';
              const isOverdue =
                isOpen && Date.now() - new Date(report.createdAt).getTime() > REVIEW_SLA_MS;
              const canRemoveContent = report.targetType !== 'USER';
              return (
                <ReportCard key={report.id} data-testid={`report-card-${report.id}`}>
                  <CardHeader>
                    <TypeBadge>{t(`admin.reports.targetTypes.${report.targetType}`)}</TypeBadge>
                    <ReasonBadge>{t(`articles.moderation.reasons.${report.reason}`)}</ReasonBadge>
                    <StatusPill $status={report.status}>
                      {t(`admin.reports.statuses.${report.status}`)}
                    </StatusPill>
                    {isOverdue && (
                      <OverduePill>
                        <AlertTriangle size={12} />
                        {t('admin.reports.overdue')}
                      </OverduePill>
                    )}
                    <DateText>
                      {t('admin.reports.reportedAt')}{' '}
                      {new Date(report.createdAt).toLocaleString()}
                    </DateText>
                  </CardHeader>

                  {report.contentSnapshot && (
                    <Snapshot>
                      <FieldLabel>{t('admin.reports.snapshot')}</FieldLabel>
                      <SnapshotText>{report.contentSnapshot}</SnapshotText>
                    </Snapshot>
                  )}

                  <MetaGrid>
                    <div>
                      <FieldLabel>{t('admin.reports.author')}</FieldLabel>
                      <span>
                        {report.targetUser?.username ?? t('admin.reports.deletedUser')}
                        {report.targetUser && !report.targetUser.isActive && (
                          <InactiveTag> · {t('admin.reports.inactive')}</InactiveTag>
                        )}
                      </span>
                    </div>
                    <div>
                      <FieldLabel>{t('admin.reports.reportedBy')}</FieldLabel>
                      <span>{report.reporter?.username ?? t('admin.reports.deletedUser')}</span>
                    </div>
                    {report.details && (
                      <div>
                        <FieldLabel>{t('admin.reports.details')}</FieldLabel>
                        <span>{report.details}</span>
                      </div>
                    )}
                  </MetaGrid>

                  {isOpen && (
                    <Actions>
                      <ActionButton
                        type="button"
                        disabled={resolveMutation.isPending}
                        onClick={() => resolve(report, { status: 'DISMISSED' })}
                        data-testid={`report-dismiss-${report.id}`}
                      >
                        <Check size={14} />
                        {t('admin.reports.dismiss')}
                      </ActionButton>
                      {canRemoveContent && (
                        <ActionButton
                          type="button"
                          $danger
                          disabled={resolveMutation.isPending}
                          onClick={() =>
                            resolve(report, { status: 'ACTION_TAKEN', removeContent: true })
                          }
                          data-testid={`report-remove-${report.id}`}
                        >
                          <Trash2 size={14} />
                          {t('admin.reports.removeContent')}
                        </ActionButton>
                      )}
                      {report.targetUser && (
                        <ActionButton
                          type="button"
                          $danger
                          disabled={resolveMutation.isPending}
                          onClick={() =>
                            resolve(report, {
                              status: 'ACTION_TAKEN',
                              removeContent: canRemoveContent,
                              deactivateUser: true,
                            })
                          }
                          data-testid={`report-deactivate-${report.id}`}
                        >
                          <Ban size={14} />
                          {canRemoveContent
                            ? t('admin.reports.removeAndDeactivate')
                            : t('admin.reports.deactivateUser')}
                        </ActionButton>
                      )}
                    </Actions>
                  )}
                </ReportCard>
              );
            })}
          </List>

          {data && data.total > data.limit && (
            <PaginationRow>
              <PageButton type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                {t('admin.reports.previous')}
              </PageButton>
              <PageInfo>{t('admin.reports.page', { page, total: totalPages })}</PageInfo>
              <PageButton
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t('admin.reports.next')}
              </PageButton>
            </PaginationRow>
          )}
        </ExercisesContent>
      </ExercisesMain>
    </ExercisesPageShell>
  );
}

const Description = styled.p`
  margin: 0 0 1rem;
  color: #94a3b8;
  font-size: 0.875rem;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FilterTab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid ${({ $active }) => ($active ? '#ef233c' : 'rgba(255, 255, 255, 0.1)')};
  background: ${({ $active }) =>
    $active ? 'rgba(239, 35, 60, 0.15)' : 'rgba(255, 255, 255, 0.04)'};
  color: ${({ $active }) => ($active ? '#ffffff' : '#94a3b8')};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReportCard = styled.article`
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #0f1220;
  padding: 1.25rem;
`;

const CardHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
`;

const TypeBadge = styled(Pill)`
  color: #93c5fd;
  background: rgba(59, 130, 246, 0.12);
`;

const ReasonBadge = styled(Pill)`
  color: #fda4af;
  background: rgba(239, 35, 60, 0.12);
`;

const StatusPill = styled(Pill)<{ $status: ReportStatus }>`
  color: ${({ $status }) =>
    $status === 'OPEN' ? '#f59e0b' : $status === 'ACTION_TAKEN' ? '#34d399' : '#94a3b8'};
  background: ${({ $status }) =>
    $status === 'OPEN'
      ? 'rgba(245, 158, 11, 0.12)'
      : $status === 'ACTION_TAKEN'
        ? 'rgba(52, 211, 153, 0.12)'
        : 'rgba(148, 163, 184, 0.12)'};
`;

const OverduePill = styled(Pill)`
  color: #ffffff;
  background: #ef4444;
`;

const DateText = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  color: #64748b;
`;

const Snapshot = styled.div`
  margin-bottom: 0.85rem;
`;

const SnapshotText = styled.p`
  margin: 0;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  color: #e2e8f0;
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
`;

const FieldLabel = styled.span`
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-bottom: 0.25rem;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #cbd5e1;
`;

const InactiveTag = styled.span`
  color: #f87171;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  background: ${({ $danger }) =>
    $danger ? 'rgba(239, 68, 68, 0.15)' : 'rgba(148, 163, 184, 0.12)'};
  color: ${({ $danger }) => ($danger ? '#f87171' : '#cbd5e1')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const MutedText = styled.p`
  color: #64748b;
  text-align: center;
  padding: 2rem;
`;

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAdminOverview } from '../../hooks/useAdminOverview';
import type {
  AdminOverview as AdminOverviewData,
  OverviewPlan,
  OverviewRole,
  RecentActivityItem,
} from '../../types/adminOverview';
import { ROLE_COLORS } from './colors';
import { SignupsChart } from './SignupsChart';
import {
  BarRow,
  Bars,
  Card,
  CardHead,
  CardTitle,
  Delta,
  Dot,
  ErrorBox,
  Eyebrow,
  Fill,
  Legend,
  LinkButton,
  Mini,
  MiniGrid,
  Muted,
  Track,
} from './ui';

const DAY_MS = 24 * 60 * 60 * 1000;
const ROLES: OverviewRole[] = ['Client', 'Trainer', 'Gym'];
const PLANS: OverviewPlan[] = ['plus', 'pro', 'maximum'];
const PLAN_COLORS: Record<OverviewPlan, string> = {
  plus: '#7c8cff',
  pro: '#ef233c',
  maximum: '#f7c873',
};
const SEVERITY = { crit: '#ef4d5f', warn: '#f7c873', info: '#7c8cff' } as const;

type Severity = keyof typeof SEVERITY;

/**
 * Admin dashboard: what needs attention, account totals, signups, revenue,
 * subscriptions and platform activity, all from `GET /admin/overview`.
 */
export function AdminOverview({ username }: { username: string }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useAdminOverview();
  const locale = i18n.language;
  const nf = new Intl.NumberFormat(locale);
  const usd = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });

  return (
    <Wrap data-testid="admin-overview">
      <Header>
        <SectionLabel>{t('admin.overview.label')}</SectionLabel>
        <Greeting>{t('dashboard.greeting', { username: username.toUpperCase() })}</Greeting>
        <Headline>
          {t('admin.overview.headlinePrefix')} <Accent>{t('admin.overview.headlineAccent')}</Accent>
        </Headline>
        {data?.exchangeRate && (
          <Eyebrow data-testid="bcv-rate">
            {t('admin.overview.bcvRate', {
              rate: new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(
                data.exchangeRate.rate,
              ),
            })}
          </Eyebrow>
        )}
      </Header>

      {isLoading && !data && <Muted>{t('common.loading', 'Loading...')}</Muted>}
      {isError && !data && (
        <ErrorBox role="alert">
          {t('admin.overview.loadFailed')}{' '}
          <LinkButton type="button" onClick={() => refetch()}>
            {t('admin.overview.retry')}
          </LinkButton>
        </ErrorBox>
      )}

      {data && (
        <>
          <Section>
            <SectionTitle>{t('admin.overview.attention')}</SectionTitle>
            <FourGrid>
              <AttentionCard
                severity={data.attention.pendingPayments.count ? 'crit' : 'info'}
                label={t('admin.overview.pendingPayments')}
                value={nf.format(data.attention.pendingPayments.count)}
                sub={
                  data.attention.pendingPayments.oldestWaitingHours === null
                    ? t('admin.overview.nothingPending')
                    : t('admin.overview.pendingSub', {
                        age: formatWaiting(data.attention.pendingPayments.oldestWaitingHours, t),
                        amount: usd.format(data.attention.pendingPayments.totalUsd),
                      })
                }
                action={t('admin.overview.review')}
                onClick={() => navigate('/admin/payments')}
                testId="attention-payments"
              />
              <AttentionCard
                severity={data.attention.expiringPlans.count ? 'warn' : 'info'}
                label={t('admin.overview.plansEnding')}
                value={nf.format(data.attention.expiringPlans.count)}
                sub={t('admin.overview.remindedSub', {
                  count: data.attention.expiringPlans.remindedCount,
                })}
                action={t('admin.overview.seeUsers')}
                onClick={() => navigate('/admin/users')}
                testId="attention-expiring"
              />
              <AttentionCard
                severity={data.attention.gymTrialsEnding.count ? 'warn' : 'info'}
                label={t('admin.overview.trialsEnding')}
                value={nf.format(data.attention.gymTrialsEnding.count)}
                sub={t('admin.overview.trialsSub')}
                action={t('admin.overview.seeUsers')}
                onClick={() => navigate('/admin/users')}
                testId="attention-trials"
              />
              <AttentionCard
                severity={data.attention.openReports.count ? 'crit' : 'info'}
                label={t('admin.overview.openReports')}
                value={nf.format(data.attention.openReports.count)}
                sub={t('admin.overview.reportsSub')}
                action={t('admin.overview.moderate')}
                onClick={() => navigate('/admin/reports')}
                testId="attention-reports"
              />
            </FourGrid>
          </Section>

          <Section>
            <SectionTitle>{t('admin.overview.accounts')}</SectionTitle>
            <FourGrid>
              <Kpi
                label={t('admin.overview.totalUsers')}
                color="#f5f6ff"
                value={nf.format(data.accounts.total)}
                delta={nf.format(data.accounts.newLast30Days)}
                t={t}
                testId="kpi-total"
              />
              {ROLES.map((role) => (
                <Kpi
                  key={role}
                  label={t(`admin.overview.roles.${role}`)}
                  color={ROLE_COLORS[role]}
                  value={nf.format(data.accounts.byRole[role].total)}
                  delta={nf.format(data.accounts.byRole[role].newLast30Days)}
                  extra={
                    role === 'Gym'
                      ? t('admin.overview.onTrial', { count: data.accounts.gymsOnTrial })
                      : undefined
                  }
                  t={t}
                  testId={`kpi-${role.toLowerCase()}`}
                />
              ))}
            </FourGrid>
          </Section>

          <TwoGrid>
            <Card>
              <CardHead>
                <div>
                  <Eyebrow>{t('admin.overview.last30Days')}</Eyebrow>
                  <CardTitle>{t('admin.overview.newSignups')}</CardTitle>
                </div>
                <Legend>
                  {ROLES.map((role) => (
                    <span key={role}>
                      <Dot $color={ROLE_COLORS[role]} />
                      {t(`admin.overview.roles.${role}`)}
                    </span>
                  ))}
                </Legend>
              </CardHead>
              <SignupsChart
                days={data.signups}
                locale={locale}
                ariaLabel={t('admin.overview.signupsAria')}
              />
            </Card>
            <RevenueCard data={data} locale={locale} />
          </TwoGrid>

          <ThreeGrid>
            <Card data-testid="expiring-list">
              <CardHead>
                <div>
                  <Eyebrow>{t('admin.overview.next7Days')}</Eyebrow>
                  <CardTitle>{t('admin.overview.plansEnding')}</CardTitle>
                </div>
              </CardHead>
              {data.expiringPlans.length === 0 ? (
                <Muted>{t('admin.overview.noPlansEnding')}</Muted>
              ) : (
                <TableWrap>
                  <table>
                    <thead>
                      <tr>
                        <th>{t('admin.overview.user')}</th>
                        <th>{t('admin.overview.rolePlan')}</th>
                        <th>{t('admin.overview.ends')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.expiringPlans.map((row) => {
                        const days = Math.max(
                          0,
                          Math.ceil((new Date(row.paidUntil).getTime() - new Date(data.generatedAt).getTime()) / DAY_MS),
                        );
                        return (
                          <tr key={row.userId}>
                            <td>{row.username}</td>
                            <td>
                              {t(`admin.overview.roles.${row.role}`)} ·{' '}
                              {t(`admin.overview.plans.${row.plan}`)}
                            </td>
                            <td>
                              <Pill $color={days <= 2 ? SEVERITY.crit : SEVERITY.warn}>
                                {days <= 1
                                  ? t('admin.overview.endsTomorrow')
                                  : t('admin.overview.endsInDays', { count: days })}
                              </Pill>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableWrap>
              )}
            </Card>

            <Card data-testid="plan-mix">
              <Eyebrow>{t('admin.overview.planMix')}</Eyebrow>
              <BigLine>
                {nf.format(data.planMix.payingUsers)}{' '}
                <small>
                  {t('admin.overview.payingOf', {
                    total: nf.format(data.planMix.totalUsers),
                    percent: data.planMix.totalUsers
                      ? ((data.planMix.payingUsers / data.planMix.totalUsers) * 100).toFixed(1)
                      : '0',
                  })}
                </small>
              </BigLine>
              <StackBar>
                {PLANS.filter((p) => data.planMix.byPlan[p] > 0).map((plan) => (
                  <div
                    key={plan}
                    style={{ flex: data.planMix.byPlan[plan], background: PLAN_COLORS[plan] }}
                  />
                ))}
              </StackBar>
              <Legend>
                {PLANS.map((plan) => (
                  <span key={plan}>
                    <Dot $color={PLAN_COLORS[plan]} />
                    {t(`admin.overview.plans.${plan}`)} {nf.format(data.planMix.byPlan[plan])}
                  </span>
                ))}
              </Legend>
              <MiniGrid>
                <Mini value={nf.format(data.planMix.lapsedLast30Days)} label={t('admin.overview.lapsed')} />
                <Mini value={nf.format(data.planMix.inDowngradeGrace)} label={t('admin.overview.inGrace')} />
              </MiniGrid>
            </Card>

            <Card data-testid="platform-activity">
              <Eyebrow>{t('admin.overview.activity7d')}</Eyebrow>
              <MiniGrid>
                <Mini value={nf.format(data.activity.workoutsLogged)} label={t('admin.overview.workoutsLogged')} />
                <Mini value={nf.format(data.activity.activeUsers)} label={t('admin.overview.activeUsers')} />
                <Mini value={nf.format(data.activity.activeContracts)} label={t('admin.overview.activeContracts')} />
                <Mini value={nf.format(data.activity.pendingContracts)} label={t('admin.overview.pendingContracts')} />
                <Mini value={nf.format(data.activity.articlesPublished)} label={t('admin.overview.articlesPublished')} />
                <Mini value={nf.format(data.activity.routinesCreated)} label={t('admin.overview.routinesCreated')} />
              </MiniGrid>
            </Card>
          </ThreeGrid>

          <Card data-testid="recent-activity">
            <CardTitle>{t('admin.overview.recentActivity')}</CardTitle>
            {data.recentActivity.length === 0 ? (
              <Muted>{t('admin.overview.noActivity')}</Muted>
            ) : (
              <Feed>
                {data.recentActivity.map((item, i) => (
                  <li key={`${item.type}-${item.at}-${i}`}>
                    <Dot $color={activityColor(item)} />
                    <span>{describeActivity(item, t, usd)}</span>
                    <small>{formatRelative(item.at, data.generatedAt, locale)}</small>
                  </li>
                ))}
              </Feed>
            )}
          </Card>
        </>
      )}
    </Wrap>
  );
}

type TFn = ReturnType<typeof useTranslation>['t'];

function formatWaiting(hours: number, t: TFn): string {
  return hours < 24
    ? t('admin.overview.hours', { count: hours })
    : t('admin.overview.days', { count: Math.floor(hours / 24) });
}

/** Relative to when the server built the overview, keeping render pure. */
function formatRelative(iso: string, nowIso: string, locale: string): string {
  const diffSec = (new Date(iso).getTime() - new Date(nowIso).getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const abs = Math.abs(diffSec);
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  return rtf.format(Math.round(diffSec / 86400), 'day');
}

function activityColor(item: RecentActivityItem): string {
  switch (item.type) {
    case 'signup':
      return item.role === 'Trainer' ? ROLE_COLORS.Trainer : ROLE_COLORS.Client;
    case 'gym_created':
      return ROLE_COLORS.Gym;
    case 'payment_approved':
      return '#3ecf8e';
    case 'payment_rejected':
    case 'report':
      return SEVERITY.crit;
    default:
      return SEVERITY.warn;
  }
}

function describeActivity(item: RecentActivityItem, t: TFn, usd: Intl.NumberFormat): string {
  const actor = item.actor ?? t('admin.overview.deletedUser');
  const role = item.role ? t(`admin.overview.roles.${item.role}`, item.role) : '';
  const plan = item.plan ? t(`admin.overview.plans.${item.plan}`, item.plan) : '';
  const method = item.method ? t(`admin.overview.methods.${item.method}`, item.method) : '';
  const amount = item.amountUsd === null ? '' : usd.format(item.amountUsd);
  switch (item.type) {
    case 'signup':
      return t('admin.overview.feed.signup', { actor, role });
    case 'gym_created':
      return t('admin.overview.feed.gymCreated', { actor });
    case 'payment_submitted':
      return t('admin.overview.feed.paymentSubmitted', { actor, amount, method, role, plan });
    case 'payment_approved':
      return t('admin.overview.feed.paymentApproved', { actor, amount, role, plan });
    case 'payment_rejected':
      return t('admin.overview.feed.paymentRejected', { actor, amount });
    case 'report':
      return t('admin.overview.feed.report', {
        actor,
        target: t(`admin.overview.targets.${item.targetType}`, item.targetType ?? ''),
        reason: t(`articles.moderation.reasons.${item.reason}`, item.reason ?? ''),
      });
  }
}

function RevenueCard({ data, locale }: { data: AdminOverviewData; locale: string }) {
  const { t } = useTranslation();
  const usd = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
  const nf = new Intl.NumberFormat(locale);
  const { revenue, exchangeRate } = data;
  const maxMethod = Math.max(1, ...revenue.byMethod.map((m) => m.amountUsd));
  const change = revenue.previousMonthUsd
    ? Math.round(((revenue.monthUsd - revenue.previousMonthUsd) / revenue.previousMonthUsd) * 100)
    : null;
  const month = new Date(data.generatedAt).toLocaleDateString(locale, { month: 'long' });

  return (
    <Card data-testid="revenue-card">
      <Eyebrow>{t('admin.overview.revenue', { month })}</Eyebrow>
      <Money>{usd.format(revenue.monthUsd)}</Money>
      <Muted>
        {change !== null && (
          <Delta $positive={change >= 0}>
            {change >= 0 ? '+' : ''}
            {change}%
          </Delta>
        )}{' '}
        {change !== null ? t('admin.overview.vsLastMonth') : t('admin.overview.noLastMonth')}
        {exchangeRate &&
          ` · ≈ ${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
            revenue.monthUsd * exchangeRate.rate,
          )} VES`}
      </Muted>
      {revenue.byMethod.length > 0 && (
        <Bars>
          {revenue.byMethod.map((m) => (
            <BarRow key={m.method}>
              <span>{t(`admin.overview.methods.${m.method}`, m.method)}</span>
              <Track>
                <Fill style={{ width: `${(m.amountUsd / maxMethod) * 100}%` }} />
              </Track>
              <span>{usd.format(m.amountUsd)}</span>
            </BarRow>
          ))}
        </Bars>
      )}
      <MiniGrid>
        <Mini value={nf.format(revenue.approvedCount)} label={t('admin.overview.approved')} />
        <Mini
          value={nf.format(revenue.rejectedCount)}
          label={t('admin.overview.rejected')}
          color={revenue.rejectedCount ? SEVERITY.crit : undefined}
        />
      </MiniGrid>
    </Card>
  );
}

type AttentionCardProps = {
  severity: Severity;
  label: string;
  value: string;
  sub: string;
  action: string;
  onClick: () => void;
  testId: string;
};

function AttentionCard({ severity, label, value, sub, action, onClick, testId }: AttentionCardProps) {
  return (
    <AttentionButton type="button" onClick={onClick} $color={SEVERITY[severity]} data-testid={testId}>
      <Eyebrow>{label}</Eyebrow>
      <AttentionValue>{value}</AttentionValue>
      <AttentionSub>{sub}</AttentionSub>
      <AttentionAction>{action} →</AttentionAction>
    </AttentionButton>
  );
}

type KpiProps = {
  label: string;
  color: string;
  value: string;
  delta: string;
  extra?: string;
  t: TFn;
  testId: string;
};

function Kpi({ label, color, value, delta, extra, t, testId }: KpiProps) {
  return (
    <Card data-testid={testId}>
      <CardHead>
        <Eyebrow>{label}</Eyebrow>
        <Dot $color={color} />
      </CardHead>
      <KpiValue>{value}</KpiValue>
      <Muted>
        <Delta $positive>+{delta}</Delta> {t('admin.overview.last30DaysLower')}
        {extra ? ` · ${extra}` : ''}
      </Muted>
    </Card>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin-top: 0.75rem;
  width: 100%;
  font-variant-numeric: tabular-nums;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionLabel = styled.p`
  margin: 0;
  color: #efc0c4;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const Greeting = styled.p`
  margin: 0;
  color: #efc0c4;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.42em;
  text-transform: uppercase;
`;

const Headline = styled.h1`
  color: #f4f5ff;
  margin: 0;
  font-size: clamp(2.2rem, 4.2vw, 4.2rem);
  line-height: 1.05;
  font-style: italic;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-transform: uppercase;
`;

const Accent = styled.span`
  color: #ef233c;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #f4f5ff;
  font-size: 1.35rem;
  font-weight: 800;
  text-transform: uppercase;
`;

const FourGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const TwoGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 0.9rem;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const ThreeGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.9rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const AttentionButton = styled.button<{ $color: string }>`
  position: relative;
  overflow: hidden;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1rem 1.15rem 1rem 1.35rem;
  border-radius: 1.15rem;
  border: 1px solid rgba(126, 136, 175, 0.18);
  background: linear-gradient(180deg, #181d36 0%, #12152d 100%);
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: ${({ $color }) => $color};
  }

  &:hover,
  &:focus-visible {
    border-color: rgba(239, 192, 196, 0.6);
    transform: translateY(-1px);
    outline: none;
  }
`;

const AttentionValue = styled.span`
  font-size: 2.3rem;
  font-weight: 800;
  line-height: 1;
  color: #f5f6ff;
`;

const AttentionSub = styled.span`
  font-size: 0.78rem;
  color: #8a90b2;
`;

const AttentionAction = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #efc0c4;
`;

const KpiValue = styled.p`
  margin: 0.6rem 0 0;
  color: #f5f6ff;
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.1;
`;

const Money = styled.p`
  margin: 0.5rem 0 0;
  font-size: 2.5rem;
  font-weight: 800;
  color: #f5f6ff;
`;

const BigLine = styled.p`
  margin: 0.6rem 0 0;
  font-size: 2.1rem;
  font-weight: 800;
  color: #f5f6ff;

  small {
    font-size: 0.8rem;
    font-weight: 500;
    color: #8a90b2;
  }
`;

const StackBar = styled.div`
  display: flex;
  gap: 2px;
  height: 14px;
  border-radius: 99px;
  overflow: hidden;
  margin-top: 0.75rem;
  background: rgba(126, 136, 175, 0.16);
`;

const TableWrap = styled.div`
  overflow-x: auto;
  margin-top: 0.6rem;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
    color: #d4d8ee;
  }
  th {
    text-align: left;
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #8a90b2;
    font-weight: 700;
    padding: 0 0.5rem 0.5rem;
  }
  td {
    padding: 0.6rem 0.5rem;
    border-top: 1px solid rgba(126, 136, 175, 0.18);
    white-space: nowrap;
  }
`;

const Pill = styled.span<{ $color: string }>`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.55rem;
  border-radius: 99px;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => `${$color}26`};
`;

const Feed = styled.ul`
  list-style: none;
  margin: 0.6rem 0 0;
  padding: 0;

  li {
    display: grid;
    grid-template-columns: 10px minmax(0, 1fr) auto;
    gap: 0.7rem;
    align-items: center;
    padding: 0.65rem 0;
    border-top: 1px solid rgba(126, 136, 175, 0.18);
    font-size: 0.85rem;
    color: #d4d8ee;
  }
  small {
    color: #8a90b2;
    white-space: nowrap;
  }
`;


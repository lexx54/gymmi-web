import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics';
import {
  ANALYTICS_RANGES,
  type AdminAnalytics as AdminAnalyticsData,
  type AmountBreakdown,
  type AnalyticsRange,
  type PeriodMetric,
} from '../../types/adminAnalytics';
import type { OverviewRole } from '../../types/adminOverview';
import { ROLE_COLORS } from '../admin-dashboard/colors';
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
  Muted,
  Track,
} from '../admin-dashboard/ui';
import { ANALYTICS_TABS, type AnalyticsTab, bucketLabel, percentChange } from './format';
import { TrendChart } from './TrendChart';

const ROLES: OverviewRole[] = ['Client', 'Trainer', 'Gym'];
const ACCENT = '#ef233c';
const SECONDARY = '#7c8cff';
const GOLD = '#f7c873';

type TFn = ReturnType<typeof useTranslation>['t'];

/**
 * Admin Analytics: platform trends over a selectable window, split into
 * Growth, Revenue, Engagement and Content tabs. Tab and range live in the
 * URL (`?tab=&range=`) so a view can be shared.
 */
export function AdminAnalytics() {
  const { t, i18n } = useTranslation();
  const [params, setParams] = useSearchParams();
  const tab = (ANALYTICS_TABS as readonly string[]).includes(params.get('tab') ?? '')
    ? (params.get('tab') as AnalyticsTab)
    : 'growth';
  const range = (ANALYTICS_RANGES as readonly string[]).includes(params.get('range') ?? '')
    ? (params.get('range') as AnalyticsRange)
    : '30d';
  const { data, isLoading, isError, isFetching, refetch } = useAdminAnalytics(range);
  const locale = i18n.language;

  const update = (key: 'tab' | 'range', value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(key, value);
        return next;
      },
      { replace: true },
    );

  return (
    <Wrap data-testid="admin-analytics">
      <Toolbar>
        <TabList role="tablist" aria-label={t('admin.analytics.tabsLabel')}>
          {ANALYTICS_TABS.map((key) => (
            <TabButton
              key={key}
              type="button"
              role="tab"
              id={`analytics-tab-${key}`}
              aria-selected={tab === key}
              aria-controls="analytics-panel"
              $active={tab === key}
              onClick={() => update('tab', key)}
            >
              {t(`admin.analytics.tabs.${key}`)}
            </TabButton>
          ))}
        </TabList>
        <RangeGroup role="group" aria-label={t('admin.analytics.rangeLabel')}>
          {ANALYTICS_RANGES.map((key) => (
            <RangeButton
              key={key}
              type="button"
              aria-pressed={range === key}
              $active={range === key}
              onClick={() => update('range', key)}
            >
              {t(`admin.analytics.ranges.${key}`)}
            </RangeButton>
          ))}
        </RangeGroup>
      </Toolbar>

      {isLoading && !data && <Muted>{t('common.loading', 'Loading...')}</Muted>}
      {isError && !data && (
        <ErrorBox role="alert">
          {t('admin.analytics.loadFailed')}{' '}
          <LinkButton type="button" onClick={() => refetch()}>
            {t('admin.overview.retry')}
          </LinkButton>
        </ErrorBox>
      )}

      {data && (
        <Panel
          id="analytics-panel"
          role="tabpanel"
          aria-labelledby={`analytics-tab-${tab}`}
          aria-busy={isFetching}
          $stale={isFetching && data.range !== range}
        >
          <Muted>{t('admin.analytics.comparedTo', { range: t(`admin.analytics.ranges.${data.range}`) })}</Muted>
          {tab === 'growth' && <GrowthTab data={data} locale={locale} t={t} />}
          {tab === 'revenue' && <RevenueTab data={data} locale={locale} t={t} />}
          {tab === 'engagement' && <EngagementTab data={data} locale={locale} t={t} />}
          {tab === 'content' && <ContentTab data={data} locale={locale} t={t} />}
        </Panel>
      )}
    </Wrap>
  );
}

type TabProps = { data: AdminAnalyticsData; locale: string; t: TFn };

function GrowthTab({ data, locale, t }: TabProps) {
  const nf = new Intl.NumberFormat(locale);
  const { growth, bucket } = data;
  const conversion = growth.gymTrials.started
    ? Math.round((growth.gymTrials.converted / growth.gymTrials.started) * 100)
    : null;
  const roleSeries = ROLES.map((role) => ({
    key: role,
    color: ROLE_COLORS[role],
    label: t(`admin.overview.roles.${role}`),
  }));
  const maxRole = Math.max(1, ...ROLES.map((r) => growth.signupsByRole[r].current));

  return (
    <>
      <KpiGrid>
        <Kpi label={t('admin.analytics.newSignups')} value={nf.format(growth.signups.current)} metric={growth.signups} t={t} testId="kpi-signups" />
        <Kpi label={t('admin.analytics.totalUsers')} value={nf.format(growth.totalUsers)} t={t} testId="kpi-total-users" />
        <Kpi
          label={t('admin.analytics.lapsedPlans')}
          value={nf.format(growth.lapsed.current)}
          metric={growth.lapsed}
          lowerIsBetter
          t={t}
          testId="kpi-lapsed"
        />
        <Kpi
          label={t('admin.analytics.trialConversion')}
          value={conversion === null ? '—' : `${conversion}%`}
          sub={t('admin.analytics.trialConversionSub', {
            converted: nf.format(growth.gymTrials.converted),
            started: nf.format(growth.gymTrials.started),
          })}
          t={t}
          testId="kpi-trial-conversion"
        />
      </KpiGrid>

      <TwoGrid>
        <Card>
          <CardHead>
            <CardTitle>{t('admin.analytics.signupsOverTime')}</CardTitle>
            <SeriesLegend series={roleSeries} />
          </CardHead>
          <TrendChart
            points={growth.series}
            series={roleSeries}
            mode="stacked"
            bucket={bucket}
            locale={locale}
            ariaLabel={t('admin.analytics.signupsOverTime')}
            testId="growth-signups-chart"
          />
        </Card>
        <Card>
          <CardTitle>{t('admin.analytics.signupsByRole')}</CardTitle>
          <Bars>
            {ROLES.map((role) => {
              const m = growth.signupsByRole[role];
              return (
                <BarRow key={role}>
                  <span>{t(`admin.overview.roles.${role}`)}</span>
                  <Track>
                    <Fill style={{ width: `${(m.current / maxRole) * 100}%`, background: ROLE_COLORS[role] }} />
                  </Track>
                  <span>
                    {nf.format(m.current)} <ChangeTag metric={m} />
                  </span>
                </BarRow>
              );
            })}
          </Bars>
        </Card>
      </TwoGrid>

      <Card>
        <CardTitle>{t('admin.analytics.totalUsersOverTime')}</CardTitle>
        <TrendChart
          points={growth.series}
          series={[{ key: 'totalUsers', color: SECONDARY, label: t('admin.analytics.totalUsers') }]}
          mode="line"
          bucket={bucket}
          locale={locale}
          ariaLabel={t('admin.analytics.totalUsersOverTime')}
          testId="growth-total-chart"
        />
      </Card>
    </>
  );
}

function RevenueTab({ data, locale, t }: TabProps) {
  const { revenue, bucket, exchangeRate } = data;
  const nf = new Intl.NumberFormat(locale);
  const usd = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
  const usdCompact = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  });

  return (
    <>
      <KpiGrid>
        <Kpi
          label={t('admin.analytics.revenue')}
          value={usd.format(revenue.totalUsd.current)}
          metric={revenue.totalUsd}
          sub={
            exchangeRate
              ? `≈ ${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
                  revenue.totalUsd.current * exchangeRate.rate,
                )} VES`
              : undefined
          }
          t={t}
          testId="kpi-revenue"
        />
        <Kpi
          label={t('admin.analytics.approvedPayments')}
          value={nf.format(revenue.approvedCount.current)}
          metric={revenue.approvedCount}
          sub={t('admin.analytics.rejectedSub', { count: revenue.rejectedCount })}
          t={t}
          testId="kpi-approved"
        />
        <Kpi
          label={t('admin.analytics.arpu')}
          value={usd.format(revenue.arpuUsd)}
          sub={t('admin.analytics.payingUsersSub', { count: revenue.payingUsers })}
          t={t}
          testId="kpi-arpu"
        />
        <Kpi
          label={t('admin.analytics.avgReviewTime')}
          value={revenue.avgReviewHours === null ? '—' : formatHours(revenue.avgReviewHours, t)}
          sub={t('admin.analytics.avgReviewSub')}
          t={t}
          testId="kpi-review-time"
        />
      </KpiGrid>

      <Card>
        <CardTitle>{t('admin.analytics.revenueOverTime')}</CardTitle>
        <TrendChart
          points={revenue.series}
          series={[{ key: 'amountUsd', color: ACCENT, label: t('admin.analytics.revenue') }]}
          mode="stacked"
          bucket={bucket}
          locale={locale}
          formatValue={(v) => usdCompact.format(v)}
          ariaLabel={t('admin.analytics.revenueOverTime')}
          testId="revenue-chart"
        />
      </Card>

      <ThreeGrid>
        <BreakdownCard
          title={t('admin.analytics.byPlan')}
          rows={revenue.byPlan}
          label={(k) => t(`admin.overview.plans.${k}`, k)}
          usd={usd}
          t={t}
          testId="revenue-by-plan"
        />
        <BreakdownCard
          title={t('admin.analytics.byMethod')}
          rows={revenue.byMethod}
          label={(k) => t(`admin.overview.methods.${k}`, k)}
          usd={usd}
          t={t}
          testId="revenue-by-method"
        />
        <BreakdownCard
          title={t('admin.analytics.byRole')}
          rows={revenue.byRole}
          label={(k) => t(`admin.overview.roles.${k}`, k)}
          color={(k) => ROLE_COLORS[k as OverviewRole]}
          usd={usd}
          t={t}
          testId="revenue-by-role"
        />
      </ThreeGrid>
    </>
  );
}

function EngagementTab({ data, locale, t }: TabProps) {
  const { engagement, bucket } = data;
  const nf = new Intl.NumberFormat(locale);
  const maxWeeks = Math.max(1, ...engagement.retention.map((c) => c.rates.length));

  return (
    <>
      <KpiGrid>
        <Kpi label={t('admin.analytics.workouts')} value={nf.format(engagement.workouts.current)} metric={engagement.workouts} t={t} testId="kpi-workouts" />
        <Kpi label={t('admin.analytics.activeUsers')} value={nf.format(engagement.activeUsers.current)} metric={engagement.activeUsers} t={t} testId="kpi-active-users" />
        <Kpi
          label={t('admin.analytics.avgSession')}
          value={
            engagement.avgSessionMinutes === null
              ? '—'
              : t('admin.analytics.minutes', { count: engagement.avgSessionMinutes })
          }
          t={t}
          testId="kpi-avg-session"
        />
        <Kpi
          label={t('admin.analytics.newContracts')}
          value={nf.format(engagement.contracts.created.current)}
          metric={engagement.contracts.created}
          sub={t('admin.analytics.contractsSub', {
            active: nf.format(engagement.contracts.active),
            pending: nf.format(engagement.contracts.pending),
          })}
          t={t}
          testId="kpi-contracts"
        />
      </KpiGrid>

      <EvenGrid>
        <Card>
          <CardTitle>{t('admin.analytics.workoutsOverTime')}</CardTitle>
          <TrendChart
            points={engagement.series}
            series={[{ key: 'workouts', color: ACCENT, label: t('admin.analytics.workouts') }]}
            mode="stacked"
            bucket={bucket}
            locale={locale}
            ariaLabel={t('admin.analytics.workoutsOverTime')}
            testId="workouts-chart"
          />
        </Card>
        <Card>
          <CardTitle>{t('admin.analytics.activeUsersOverTime')}</CardTitle>
          <TrendChart
            points={engagement.series}
            series={[{ key: 'activeUsers', color: SECONDARY, label: t('admin.analytics.activeUsers') }]}
            mode="line"
            bucket={bucket}
            locale={locale}
            ariaLabel={t('admin.analytics.activeUsersOverTime')}
            testId="active-users-chart"
          />
        </Card>
      </EvenGrid>

      <Card data-testid="retention">
        <CardHead>
          <div>
            <Eyebrow>{t('admin.analytics.retentionEyebrow')}</Eyebrow>
            <CardTitle>{t('admin.analytics.retention')}</CardTitle>
          </div>
        </CardHead>
        <Muted>{t('admin.analytics.retentionHelp')}</Muted>
        {engagement.retention.length === 0 ? (
          <Muted>{t('admin.analytics.noCohorts')}</Muted>
        ) : (
          <CohortTable>
            <table>
              <thead>
                <tr>
                  <th>{t('admin.analytics.cohort')}</th>
                  <th>{t('admin.analytics.users')}</th>
                  {Array.from({ length: maxWeeks }, (_, i) => (
                    <th key={i}>{t('admin.analytics.weekN', { n: i })}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {engagement.retention.map((cohort) => (
                  <tr key={cohort.week}>
                    <td>{bucketLabel(cohort.week, 'week', locale)}</td>
                    <td>{nf.format(cohort.size)}</td>
                    {Array.from({ length: maxWeeks }, (_, i) => {
                      const rate = cohort.rates[i];
                      return rate === undefined ? (
                        <td key={i} />
                      ) : (
                        <HeatCell key={i} $rate={rate}>
                          {Math.round(rate * 100)}%
                        </HeatCell>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CohortTable>
        )}
      </Card>
    </>
  );
}

function ContentTab({ data, locale, t }: TabProps) {
  const { content, bucket } = data;
  const nf = new Intl.NumberFormat(locale);
  const contentSeries = [
    { key: 'routines', color: SECONDARY, label: t('admin.analytics.routines') },
    { key: 'articles', color: GOLD, label: t('admin.analytics.articles') },
    { key: 'reports', color: ACCENT, label: t('admin.analytics.reports') },
  ];
  const maxReason = Math.max(1, ...content.reportsByReason.map((r) => r.count));

  return (
    <>
      <KpiGrid>
        <Kpi label={t('admin.analytics.routines')} value={nf.format(content.routines.current)} metric={content.routines} t={t} testId="kpi-routines" />
        <Kpi label={t('admin.analytics.articles')} value={nf.format(content.articles.current)} metric={content.articles} t={t} testId="kpi-articles" />
        <Kpi
          label={t('admin.analytics.reports')}
          value={nf.format(content.reports.current)}
          metric={content.reports}
          lowerIsBetter
          sub={t('admin.analytics.openReportsSub', { count: content.openReports })}
          t={t}
          testId="kpi-reports"
        />
        <Kpi
          label={t('admin.analytics.avgResolution')}
          value={content.avgResolutionHours === null ? '—' : formatHours(content.avgResolutionHours, t)}
          sub={t('admin.analytics.avgResolutionSub')}
          t={t}
          testId="kpi-resolution"
        />
      </KpiGrid>

      <TwoGrid>
        <Card>
          <CardHead>
            <CardTitle>{t('admin.analytics.contentOverTime')}</CardTitle>
            <SeriesLegend series={contentSeries} />
          </CardHead>
          <TrendChart
            points={content.series}
            series={contentSeries}
            mode="stacked"
            bucket={bucket}
            locale={locale}
            ariaLabel={t('admin.analytics.contentOverTime')}
            testId="content-chart"
          />
        </Card>
        <Card data-testid="reports-by-reason">
          <CardTitle>{t('admin.analytics.reportsByReason')}</CardTitle>
          {content.reportsByReason.length === 0 ? (
            <Muted>{t('admin.analytics.noReports')}</Muted>
          ) : (
            <Bars>
              {content.reportsByReason.map((r) => (
                <BarRow key={r.reason}>
                  <span>{t(`articles.moderation.reasons.${r.reason}`, r.reason)}</span>
                  <Track>
                    <Fill style={{ width: `${(r.count / maxReason) * 100}%` }} />
                  </Track>
                  <span>{nf.format(r.count)}</span>
                </BarRow>
              ))}
            </Bars>
          )}
        </Card>
      </TwoGrid>
    </>
  );
}

function formatHours(hours: number, t: TFn): string {
  return hours < 24
    ? t('admin.analytics.hoursShort', { count: Math.round(hours * 10) / 10 })
    : t('admin.analytics.daysShort', { count: Math.round((hours / 24) * 10) / 10 });
}

function SeriesLegend({ series }: { series: Array<{ key: string; color: string; label: string }> }) {
  return (
    <Legend>
      {series.map((s) => (
        <span key={s.key}>
          <Dot $color={s.color} />
          {s.label}
        </span>
      ))}
    </Legend>
  );
}

/** Change vs the previous window, colored by whether it is good news. */
function ChangeTag({ metric, lowerIsBetter = false }: { metric: PeriodMetric; lowerIsBetter?: boolean }) {
  const { t } = useTranslation();
  const change = percentChange(metric);
  if (change === null) {
    return <NeutralTag>{metric.current ? t('admin.analytics.new') : '—'}</NeutralTag>;
  }
  const good = lowerIsBetter ? change <= 0 : change >= 0;
  return (
    <Delta $positive={good}>
      {change > 0 ? '+' : ''}
      {change}%
    </Delta>
  );
}

type KpiProps = {
  label: string;
  value: string;
  metric?: PeriodMetric;
  lowerIsBetter?: boolean;
  sub?: string;
  t: TFn;
  testId: string;
};

function Kpi({ label, value, metric, lowerIsBetter, sub, t, testId }: KpiProps) {
  return (
    <Card data-testid={testId}>
      <Eyebrow>{label}</Eyebrow>
      <KpiValue>{value}</KpiValue>
      {metric && (
        <Muted>
          <ChangeTag metric={metric} lowerIsBetter={lowerIsBetter} /> {t('admin.analytics.vsPrevious')}
        </Muted>
      )}
      {sub && <Muted>{sub}</Muted>}
    </Card>
  );
}

type BreakdownCardProps<K extends string> = {
  title: string;
  rows: AmountBreakdown<K>[];
  label: (key: K) => string;
  color?: (key: K) => string;
  usd: Intl.NumberFormat;
  t: TFn;
  testId: string;
};

function BreakdownCard<K extends string>({ title, rows, label, color, usd, t, testId }: BreakdownCardProps<K>) {
  const max = Math.max(1, ...rows.map((r) => r.amountUsd));
  return (
    <Card data-testid={testId}>
      <CardTitle>{title}</CardTitle>
      {rows.length === 0 ? (
        <Muted>{t('admin.analytics.noRevenue')}</Muted>
      ) : (
        <Bars>
          {rows.map((r) => (
            <BarRow key={r.key} title={t('admin.analytics.paymentsCount', { count: r.count })}>
              <span>{label(r.key)}</span>
              <Track>
                <Fill
                  style={{
                    width: `${(r.amountUsd / max) * 100}%`,
                    ...(color ? { background: color(r.key) } : {}),
                  }}
                />
              </Track>
              <span>{usd.format(r.amountUsd)}</span>
            </BarRow>
          ))}
        </Bars>
      )}
    </Card>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: 100%;
  font-variant-numeric: tabular-nums;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: space-between;
  align-items: center;
`;

const TabList = styled.div`
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  max-width: 100%;
`;

const TabButton = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? 'rgba(239, 35, 60, 0.6)' : 'rgba(126, 136, 175, 0.18)')};
  background: ${({ $active }) => ($active ? 'rgba(239, 35, 60, 0.14)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#f5f6ff' : '#8a90b2')};
  border-radius: 99px;
  padding: 0.5rem 1rem;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #efc0c4;
    outline-offset: 2px;
  }
`;

const RangeGroup = styled.div`
  display: inline-flex;
  border: 1px solid rgba(126, 136, 175, 0.18);
  border-radius: 0.6rem;
  overflow: hidden;
`;

const RangeButton = styled.button<{ $active: boolean }>`
  border: none;
  background: ${({ $active }) => ($active ? '#ef233c' : '#181c38')};
  color: ${({ $active }) => ($active ? '#fff' : '#8a90b2')};
  padding: 0.45rem 0.8rem;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #efc0c4;
    outline-offset: -2px;
  }
`;

const Panel = styled.section<{ $stale: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  opacity: ${({ $stale }) => ($stale ? 0.55 : 1)};
  transition: opacity 0.15s ease;
`;

const KpiGrid = styled.div`
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

const EvenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const ThreeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const KpiValue = styled.p`
  margin: 0.6rem 0 0.2rem;
  color: #f5f6ff;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.1;
`;

const NeutralTag = styled.span`
  color: #8a90b2;
  font-weight: 700;
`;

const CohortTable = styled.div`
  overflow-x: auto;
  margin-top: 0.75rem;

  table {
    border-collapse: separate;
    border-spacing: 3px;
    font-size: 0.78rem;
    color: #d4d8ee;
  }
  th {
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #8a90b2;
    font-weight: 700;
    padding: 0 0.5rem 0.35rem;
    text-align: center;
    white-space: nowrap;
  }
  th:first-child,
  td:first-child {
    text-align: left;
  }
  td {
    padding: 0.45rem 0.6rem;
    white-space: nowrap;
    text-align: center;
  }
`;

const HeatCell = styled.td<{ $rate: number }>`
  border-radius: 0.4rem;
  min-width: 3rem;
  color: ${({ $rate }) => ($rate >= 0.5 ? '#fff' : '#d4d8ee')};
  background: ${({ $rate }) => `rgba(239, 35, 60, ${0.08 + $rate * 0.72})`};
`;

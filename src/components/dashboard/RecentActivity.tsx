import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type Activity = {
  id: string;
  whenKey: string;
  titleKey: string;
  metaKey: string;
};

const ACTIVITIES: Activity[] = [
  { id: 'a1', whenKey: 'dashboard.yesterday', titleKey: 'dashboard.urbanTrailRun', metaKey: 'dashboard.activityRunMeta' },
  { id: 'a2', whenKey: 'dashboard.twoDaysAgo', titleKey: 'dashboard.recoveryFlow', metaKey: 'dashboard.activityRecoveryMeta' },
  { id: 'a3', whenKey: 'dashboard.threeDaysAgo', titleKey: 'dashboard.powerLifting', metaKey: 'dashboard.activityPowerMeta' },
];

/**
 * Displays recent activity summary cards.
 */
export function RecentActivity() {
  const { t } = useTranslation();

  return (
    <Section>
      <SectionHeader>
        <Title>{t('dashboard.recentActivity')}</Title>
        <HistoryLink href="#">{t('dashboard.viewHistory')}</HistoryLink>
      </SectionHeader>
      <Cards>
        {ACTIVITIES.map((activity, index) => (
          <Card key={activity.id} $muted={index === 2}>
            <When>{t(activity.whenKey)}</When>
            <CardTitle>{t(activity.titleKey)}</CardTitle>
            <Meta>{t(activity.metaKey)}</Meta>
          </Card>
        ))}
      </Cards>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #eceefe;
  text-transform: uppercase;
  font-size: 2.1rem;
  font-weight: 750;
`;

const HistoryLink = styled.a`
  color: #e8b9bf;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.7rem;
  font-weight: 700;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
`;

const Card = styled.article<{ $muted: boolean }>`
  border-radius: 1.3rem;
  border: 1px solid rgba(126, 136, 175, 0.14);
  background: ${({ $muted }) =>
    $muted
      ? 'linear-gradient(180deg, rgba(20, 24, 45, 0.62) 0%, rgba(13, 16, 30, 0.62) 100%)'
      : 'linear-gradient(180deg, #1b203a 0%, #14182f 100%)'};
  padding: 1rem 1.1rem;
  min-height: 8.2rem;
  opacity: ${({ $muted }) => ($muted ? 0.45 : 1)};
`;

const When = styled.p`
  margin: 0;
  color: #d9ddf2;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.68rem;
  font-weight: 700;
`;

const CardTitle = styled.p`
  margin: 0.55rem 0 0.4rem;
  color: #f3f4ff;
  font-size: 1.9rem;
  font-weight: 650;
  line-height: 1.05;
`;

const Meta = styled.p`
  margin: 0;
  color: #b0b7d8;
  font-size: 0.9rem;
`;

import styled from 'styled-components';
import {
  AnalyticsContent,
  AnalyticsMain,
  AnalyticsPageShell,
} from '../components/analytics/AnalyticsShell';
import { ConsistencyHeatmapCard } from '../components/analytics/ConsistencyHeatmapCard';
import { MuscleLoadCard } from '../components/analytics/MuscleLoadCard';
import { PersonalRecordsCard } from '../components/analytics/PersonalRecordsCard';
import { VolumeTrendsCard } from '../components/analytics/VolumeTrendsCard';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { useAuth } from '../context/AuthContext';

/**
 * Analytics dashboard with static/mock training metrics.
 */
export default function AnalyticsPage() {
  const { user } = useAuth();
  const username = user?.username ?? 'Alex';

  return (
    <AnalyticsPageShell>
      <Sidebar username={username} />
      <AnalyticsMain>
        <TopBar />
        <AnalyticsContent>
          <VolumeTrendsCard />
          <MiddleGrid>
            <MuscleLoadCard />
            <ConsistencyHeatmapCard />
          </MiddleGrid>
          <PersonalRecordsCard />
        </AnalyticsContent>
      </AnalyticsMain>
    </AnalyticsPageShell>
  );
}

const MiddleGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.6fr);
  gap: 1.25rem;
`;

import styled from 'styled-components';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { RecentActivity } from '../dashboard/RecentActivity';
import { StartWorkoutButton } from '../dashboard/StartWorkoutButton';
import { StatStack } from '../dashboard/StatStack';
import { WeeklyProgressCard } from '../dashboard/WeeklyProgressCard';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

/**
 * Renders the dashboard shell with static desktop-focused sections.
 */
export function DashboardLayout() {
  const { user } = useAuth();
  const username = user?.username ?? 'Alex';

  return (
    <LayoutShell>
      <Sidebar username={username} />
      <MainPanel>
        <TopBar />
        <ContentGrid>
          <MainColumn>
            <DashboardHeader username={username} />
            <WeeklyProgressCard />
            <RecentActivity />
          </MainColumn>
          <SideColumn>
            <StatStack />
          </SideColumn>
        </ContentGrid>
        <StartWorkoutButton />
      </MainPanel>
    </LayoutShell>
  );
}

const LayoutShell = styled.div`
  display: flex;
  min-height: 100vh;
  background: radial-gradient(circle at 78% 82%, rgba(239, 35, 60, 0.26) 0%, rgba(13, 16, 32, 0) 30%),
    #0b1020;
  color: #f7f7ff;
`;

const MainPanel = styled.main`
  flex: 1;
  padding: 1.4rem 2rem 2rem;
  position: relative;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 19rem;
  gap: 1.3rem;
  margin-top: 0.75rem;
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SideColumn = styled.aside`
  padding-top: 13.7rem;
`;

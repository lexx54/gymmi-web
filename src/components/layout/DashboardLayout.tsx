import styled from 'styled-components';
import { Clock, Dumbbell, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { RecentActivity } from '../dashboard/RecentActivity';
import { StartWorkoutButton } from '../dashboard/StartWorkoutButton';
import { StatStack } from '../dashboard/StatStack';
import { WeeklyProgressCard } from '../dashboard/WeeklyProgressCard';
import { ActiveWorkoutCard } from '../dashboard/ActiveWorkoutCard';
import { useAuth } from '../../context/AuthContext';
import { useMyGym } from '../../hooks/useGyms';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

/**
 * Renders the dashboard shell with static desktop-focused sections.
 */
export function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const username = user?.username ?? 'Alex';
  const isGym = user?.role?.name === 'Gym';
  const isClient = user?.role?.name === 'Client';
  const { data: gymData } = useMyGym(isGym);

  return (
    <LayoutShell>
      <Sidebar username={username} />
      <MainPanel>
        <TopBar />
        <HeaderArea>
          <DashboardHeader username={username} />
          <ActiveWorkoutCard enabled={isClient} />
          {isGym && gymData && (
            <GymTrialBanner data-testid="gym-trial-banner">
              <BannerLeft>
                <Clock size={18} />
                <span>
                  {gymData.isTrialActive
                    ? t('gym.trialEnding', { days: gymData.trialDaysRemaining ?? 30 })
                    : t('gym.trialExpired')}
                </span>
                <CapacityBadge>
                  {t('gym.capacityProgress', {
                    current: gymData.activeMembersCount,
                    max: gymData.capacity,
                  })}
                </CapacityBadge>
              </BannerLeft>
              <BannerRight>
                <CreateRoutineBtn
                  type="button"
                  onClick={() => navigate('/workout/new')}
                  data-testid="gym-create-routine-btn"
                >
                  <Dumbbell size={15} />
                  <span>{t('gym.createRoutine')}</span>
                </CreateRoutineBtn>
                <UpgradeBtn
                  type="button"
                  onClick={() => navigate('/settings')}
                  data-testid="gym-upgrade-btn"
                >
                  <Sparkles size={15} />
                  <span>{t('gym.upgradeTier')}</span>
                </UpgradeBtn>
              </BannerRight>
            </GymTrialBanner>
          )}
        </HeaderArea>
        <ContentGrid>
          <MainColumn>
            <WeeklyProgressCard />
            <RecentActivity />
          </MainColumn>
          <SideColumn>
            <StatStack />
          </SideColumn>
        </ContentGrid>
        {isClient && <StartWorkoutButton />}
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
  min-width: 0;
  padding: 1.4rem 2rem 2rem;
  position: relative;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const HeaderArea = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.75rem;
  margin-bottom: 1.35rem;
  width: 100%;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 19rem;
  gap: 1.3rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  min-width: 0;
`;

const SideColumn = styled.aside`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const GymTrialBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.95rem 1.25rem;
  border-radius: 1.15rem;
  background: linear-gradient(180deg, rgba(239, 35, 60, 0.14) 0%, rgba(239, 35, 60, 0.04) 100%);
  border: 1px solid rgba(239, 35, 60, 0.35);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  color: #f7f7ff;
  font-size: 0.92rem;
  font-weight: 600;

  svg {
    color: #ef233c;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const CapacityBadge = styled.span`
  background: rgba(239, 35, 60, 0.2);
  border: 1px solid rgba(239, 35, 60, 0.4);
  color: #ff8a93;
  padding: 0.2rem 0.6rem;
  border-radius: 2rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const BannerRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const CreateRoutineBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.8rem;
  color: #f7f7ff;
  padding: 0.55rem 0.95rem;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    transform: translateY(-1px);
  }
`;

const UpgradeBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: linear-gradient(135deg, #ef233c 0%, #d90429 100%);
  border: none;
  border-radius: 0.8rem;
  color: #ffffff;
  padding: 0.55rem 1rem;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(239, 35, 60, 0.35);
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(239, 35, 60, 0.45);
  }
`;



import styled from 'styled-components';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { AccountSettingsCard } from '../components/settings/AccountSettingsCard';
import { DataManagementCard } from '../components/settings/DataManagementCard';
import { ProfileHeroCard } from '../components/settings/ProfileHeroCard';
import { SettingsFooter } from '../components/settings/SettingsFooter';
import {
  SettingsContent,
  SettingsMain,
  SettingsPageShell,
} from '../components/settings/SettingsShell';
import { PhysicalProfileCard } from '../components/settings/PhysicalProfileCard';
import { CoachingProfileCard } from '../components/settings/CoachingProfileCard';
import { SubscriptionSettingsCard } from '../components/settings/SubscriptionSettingsCard';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useTranslation } from 'react-i18next';

/**
 * Settings & Profile page combining user profile, physical body metrics,
 * coaching credentials (for trainers), and account configuration.
 */
export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: userProfile, isLoading } = useUserProfile();

  const effectiveProfile = userProfile ?? (user ? {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    hasPaid: user.hasPaid,
    plan: user.plan,
    profile: null,
    trainerProfile: null,
  } : null);

  const username = effectiveProfile?.username ?? 'Alex';
  const isTrainer = (effectiveProfile?.role?.name) === 'Trainer';

  return (
    <SettingsPageShell>
      <Sidebar username={username} />
      <SettingsMain>
        <TopBar title={t('settings.title')} />
        <SettingsContent>
          <ProfileHeroCard userProfile={effectiveProfile} />
          <SubscriptionSettingsCard userProfile={effectiveProfile} />
          <MiddleGrid>
            <AccountSettingsCard userProfile={effectiveProfile} />
            <PhysicalProfileCard userProfile={effectiveProfile} isLoading={isLoading} />
          </MiddleGrid>
          {isTrainer && (
            <CoachingProfileCard userProfile={effectiveProfile} isLoading={isLoading} />
          )}
          <DataManagementCard />
          <SettingsFooter />
        </SettingsContent>
      </SettingsMain>
    </SettingsPageShell>
  );
}

const MiddleGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

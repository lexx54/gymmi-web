import styled from 'styled-components';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { AccountSettingsCard } from '../components/settings/AccountSettingsCard';
import { DataManagementCard } from '../components/settings/DataManagementCard';
import { LanguageSettingsCard } from '../components/settings/LanguageSettingsCard';
import { ProfileHeroCard } from '../components/settings/ProfileHeroCard';
import { SettingsFooter } from '../components/settings/SettingsFooter';
import {
  SettingsContent,
  SettingsMain,
  SettingsPageShell,
  SettingsPageTitle,
} from '../components/settings/SettingsShell';
import { TrainingMetricsCard } from '../components/settings/TrainingMetricsCard';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

/**
 * Settings & Profile page combining user profile, account settings,
 * training metrics, and data management sections.
 */
export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const username = user?.username ?? 'Alex';

  return (
    <SettingsPageShell>
      <Sidebar username={username} />
      <SettingsMain>
        <HeaderRow>
          <SettingsPageTitle>{t('settings.title')}</SettingsPageTitle>
          <TopBar />
        </HeaderRow>
        <SettingsContent>
          <ProfileHeroCard />
          <MiddleGrid>
            <AccountSettingsCard />
            <TrainingMetricsCard />
          </MiddleGrid>
          <LanguageSettingsCard />
          <DataManagementCard />
          <SettingsFooter />
        </SettingsContent>
      </SettingsMain>
    </SettingsPageShell>
  );
}

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

const MiddleGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
import { fetchClientAnalytics, fetchMyAnalytics } from '../services/api/analytics';
import { fetchContractClients } from '../services/api/contracts';

/**
 * Analytics dashboard displaying live training metrics with client switching for trainers.
 */
export default function AnalyticsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const username = user?.username ?? 'Alex';
  const isTrainer = user?.role?.name === 'Trainer';

  const [selectedClientId, setSelectedClientId] = useState<string>('');

  // If user is a trainer, fetch contracted clients for the dropdown
  const { data: clientsRoster = [] } = useQuery({
    queryKey: ['contract-clients-roster'],
    queryFn: fetchContractClients,
    enabled: isTrainer,
  });

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', selectedClientId || 'me'],
    queryFn: () =>
      selectedClientId ? fetchClientAnalytics(selectedClientId) : fetchMyAnalytics(),
  });

  return (
    <AnalyticsPageShell>
      <Sidebar username={username} />
      <AnalyticsMain>
        <TopBar />
        <AnalyticsContent>
          {isTrainer && clientsRoster.length > 0 && (
            <HeaderControlRow>
              <ControlLabel htmlFor="client-selector">
                {t('analytics.selectClient', 'Select Client')}:
              </ControlLabel>
              <ClientSelect
                id="client-selector"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                <option value="">{t('analytics.myTraining', 'My Training')}</option>
                {clientsRoster.map((roster) => (
                  <option key={roster.client.id} value={roster.client.id}>
                    {roster.client.username} ({roster.client.email})
                  </option>
                ))}
              </ClientSelect>
            </HeaderControlRow>
          )}

          <VolumeTrendsCard data={analytics?.volumeTrends} isLoading={isLoading} />
          <MiddleGrid>
            <MuscleLoadCard data={analytics?.muscleLoad} isLoading={isLoading} />
            <ConsistencyHeatmapCard data={analytics?.consistency} isLoading={isLoading} />
          </MiddleGrid>
          <PersonalRecordsCard records={analytics?.personalRecords} isLoading={isLoading} />
        </AnalyticsContent>
      </AnalyticsMain>
    </AnalyticsPageShell>
  );
}

const HeaderControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  justify-content: flex-end;
`;

const ControlLabel = styled.label`
  color: #8e94b4;
  font-size: 0.85rem;
  font-weight: 600;
`;

const ClientSelect = styled.select`
  background: #181c38;
  color: #f5f6ff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.5rem;
  padding: 0.45rem 0.85rem;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #ef233c;
  }

  option {
    background: #181c38;
    color: #f5f6ff;
  }
`;

const MiddleGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.6fr);
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

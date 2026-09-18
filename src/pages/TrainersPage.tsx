import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import {
  CardSurface,
  SettingsContent,
  SettingsMain,
  SettingsPageShell,
  SettingsPageTitle,
} from '../components/settings/SettingsShell';
import { useAuth } from '../context/AuthContext';
import {
  useContractTrainers,
  useCreateContract,
  useMyContracts,
  useRespondContract,
} from '../hooks/useContracts';
import { WORKOUT_PERIODS, type WorkoutPeriod } from '../services/api/workouts';

/** Client directory of trainers plus contract request / cancel actions. */
export default function TrainersPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const trainers = useContractTrainers(user?.role?.name === 'Client');
  const contracts = useMyContracts(user?.role?.name === 'Client');
  const create = useCreateContract();
  const { cancel } = useRespondContract();
  const [trainerId, setTrainerId] = useState('');
  const [period, setPeriod] = useState<WorkoutPeriod>('MONTH');
  const [customEndDate, setCustomEndDate] = useState('');
  const username = user?.username ?? 'Alex';

  const request = () => {
    if (!trainerId) {
      return;
    }
    create.mutate({
      trainerId,
      period,
      customEndDate: period === 'CUSTOM' ? customEndDate : undefined,
    });
  };

  return (
    <SettingsPageShell>
      <Sidebar username={username} />
      <SettingsMain>
        <HeaderRow>
          <SettingsPageTitle>{t('nav.trainers')}</SettingsPageTitle>
          <TopBar />
        </HeaderRow>
        <SettingsContent>
          <CardSurface>
            <h2>{t('contracts.requestTitle')}</h2>
            <Row>
              <select value={trainerId} onChange={(event) => setTrainerId(event.target.value)}>
                <option value="">{t('contracts.selectTrainer')}</option>
                {trainers.data?.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.username}
                  </option>
                ))}
              </select>
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value as WorkoutPeriod)}
              >
                {WORKOUT_PERIODS.map((item) => (
                  <option key={item} value={item}>
                    {t(`workouts.periods.${item}`)}
                  </option>
                ))}
              </select>
              {period === 'CUSTOM' ? (
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(event) => setCustomEndDate(event.target.value)}
                />
              ) : null}
              <button type="button" onClick={request} disabled={create.isPending}>
                {t('contracts.sendRequest')}
              </button>
            </Row>
            {create.error ? <ErrorText>{t('contracts.requestFailed')}</ErrorText> : null}
          </CardSurface>
          <CardSurface>
            <h2>{t('contracts.myContracts')}</h2>
            {contracts.data?.length ? (
              contracts.data.map((contract) => (
                <Row key={contract.id}>
                  <span>{contract.trainer?.username ?? contract.trainerId}</span>
                  <span>{contract.status}</span>
                  <span>
                    {contract.startDate ? `${contract.startDate} – ${contract.endDate}` : '—'}
                  </span>
                  {contract.status === 'PENDING' ? (
                    <button type="button" onClick={() => cancel.mutate(contract.id)}>
                      {t('contracts.cancel')}
                    </button>
                  ) : null}
                </Row>
              ))
            ) : (
              <p>{t('contracts.noContracts')}</p>
            )}
          </CardSurface>
        </SettingsContent>
      </SettingsMain>
    </SettingsPageShell>
  );
}

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0;
`;

const ErrorText = styled.p`
  color: #ffb4ab;
`;

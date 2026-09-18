import { Link, useParams } from 'react-router-dom';
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
import { useContractClients, useMyContracts, useRespondContract } from '../hooks/useContracts';
import type { ContractClientRoster } from '../services/api/contracts';

/** Trainer roster: pending contracts, clients, assignment history, and session notes. */
export default function ClientsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { clientId } = useParams();
  const roster = useContractClients(user?.role?.name === 'Trainer');
  const mine = useMyContracts(user?.role?.name === 'Trainer');
  const { accept, reject } = useRespondContract();
  const username = user?.username ?? 'Alex';
  const selected = roster.data?.find((item) => item.client.id === clientId);
  const pending = mine.data?.filter((contract) => contract.status === 'PENDING');

  return (
    <SettingsPageShell>
      <Sidebar username={username} />
      <SettingsMain>
        <HeaderRow>
          <SettingsPageTitle>
            {selected ? selected.client.username : t('nav.clients')}
          </SettingsPageTitle>
          <TopBar />
        </HeaderRow>
        <SettingsContent>
          {roster.isLoading ? <p>{t('common.loading')}</p> : null}
          {roster.error ? <ErrorText>{t('contracts.loadFailed')}</ErrorText> : null}
          {!clientId ? (
            <>
              <CardSurface>
                <h2>{t('contracts.pending')}</h2>
                {pending?.length ? (
                  pending.map((contract) => (
                    <Row key={contract.id}>
                      <span>{contract.client?.username ?? contract.clientId}</span>
                      <span>{t(`workouts.periods.${contract.period}`)}</span>
                      <button type="button" onClick={() => accept.mutate(contract.id)}>
                        {t('contracts.accept')}
                      </button>
                      <button type="button" onClick={() => reject.mutate(contract.id)}>
                        {t('contracts.reject')}
                      </button>
                    </Row>
                  ))
                ) : (
                  <p>{t('contracts.noPending')}</p>
                )}
              </CardSurface>
              <CardSurface>
                <h2>{t('contracts.roster')}</h2>
                {roster.data?.length ? (
                  roster.data.map((item) => (
                    <Row key={item.client.id}>
                      <Link to={`/clients/${item.client.id}`}>{item.client.username}</Link>
                      <span>{item.client.email}</span>
                    </Row>
                  ))
                ) : (
                  <p>{t('contracts.noClients')}</p>
                )}
              </CardSurface>
            </>
          ) : selected ? (
            <ClientDetail item={selected} />
          ) : roster.data ? (
            <p>{t('contracts.clientMissing')}</p>
          ) : null}
        </SettingsContent>
      </SettingsMain>
    </SettingsPageShell>
  );
}

function ClientDetail({ item }: { item: ContractClientRoster }) {
  const { t } = useTranslation();
  const notes = item.sessions.filter(
    (session) => session.status === 'INCOMPLETE' && session.stopReason,
  );
  const current = item.assignments.find((assignment) => assignment.isActive);

  return (
    <>
      <CardSurface>
        <h2>{t('contracts.currentPlan')}</h2>
        {current ? (
          <Row>
            <span>{current.routine?.name ?? current.routineId}</span>
            <span>
              {current.startDate} – {current.endDate}
            </span>
            <Link to={`/workout/${current.routineId}/edit`}>{t('contracts.editPlan')}</Link>
          </Row>
        ) : (
          <p>{t('contracts.noCurrentPlan')}</p>
        )}
      </CardSurface>
      <CardSurface>
        <h2>{t('contracts.history')}</h2>
        {item.assignments.length ? (
          item.assignments.map((assignment) => (
            <Row key={assignment.id}>
              <span>{assignment.routine?.name ?? assignment.routineId}</span>
              <span>{t(`workouts.periods.${assignment.period}`)}</span>
              <span>
                {assignment.startDate} – {assignment.endDate}
              </span>
              <Link to={`/workout/${assignment.routineId}`}>{t('contracts.viewPlan')}</Link>
            </Row>
          ))
        ) : (
          <p>{t('contracts.noHistory')}</p>
        )}
      </CardSurface>
      <CardSurface>
        <h2>{t('contracts.notes')}</h2>
        {notes.length ? (
          notes.map((session) => (
            <Row key={session.id}>
              <span>{session.weekStartDate}</span>
              <span>{session.stopReason}</span>
            </Row>
          ))
        ) : (
          <p>{t('contracts.noNotes')}</p>
        )}
      </CardSurface>
    </>
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
  border-bottom: 1px solid rgba(126, 136, 175, 0.14);
`;

const ErrorText = styled.p`
  color: #ffb4ab;
`;

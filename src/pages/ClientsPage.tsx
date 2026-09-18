import {
  CalendarClock,
  Check,
  ChevronRight,
  History,
  Inbox,
  NotebookPen,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import {
  CardSurface,
  SectionTitle,
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
  const { t, i18n } = useTranslation();
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
              <PendingCard>
                <SectionTitle>
                  <UserPlus size={18} color="#ffb3b1" />
                  {t('contracts.pending')}
                  {pending?.length ? <CountBadge>{pending.length}</CountBadge> : null}
                </SectionTitle>
                {pending?.length ? (
                  <PendingList>
                    {pending.map((contract) => {
                      const name = contract.client?.username ?? contract.clientId;
                      const busy =
                        (accept.isPending && accept.variables === contract.id) ||
                        (reject.isPending && reject.variables === contract.id);

                      return (
                        <PendingItem key={contract.id}>
                          <Avatar aria-hidden>{name.slice(0, 1).toUpperCase()}</Avatar>
                          <Identity>
                            <ClientName>{name}</ClientName>
                            {contract.client?.email ? (
                              <ClientEmail>{contract.client.email}</ClientEmail>
                            ) : null}
                          </Identity>
                          <MetaGroup>
                            <PeriodPill>{t(`workouts.periods.${contract.period}`)}</PeriodPill>
                            <RequestedAt>
                              {t('contracts.requested', {
                                date: formatRequestDate(contract.createdAt, i18n.language),
                              })}
                            </RequestedAt>
                          </MetaGroup>
                          <Actions>
                            <AcceptButton
                              type="button"
                              disabled={busy}
                              onClick={() => accept.mutate(contract.id)}
                            >
                              <Check size={15} />
                              {t('contracts.accept')}
                            </AcceptButton>
                            <RejectButton
                              type="button"
                              disabled={busy}
                              onClick={() => reject.mutate(contract.id)}
                            >
                              <X size={15} />
                              {t('contracts.reject')}
                            </RejectButton>
                          </Actions>
                          {contract.message ? <MessageNote>{contract.message}</MessageNote> : null}
                        </PendingItem>
                      );
                    })}
                  </PendingList>
                ) : (
                  <EmptyState>
                    <Inbox size={18} />
                    {t('contracts.noPending')}
                  </EmptyState>
                )}
              </PendingCard>
              <PendingCard>
                <SectionTitle>
                  <Users size={18} color="#ffb3b1" />
                  {t('contracts.roster')}
                  {roster.data?.length ? <CountBadge>{roster.data.length}</CountBadge> : null}
                </SectionTitle>
                {roster.data?.length ? (
                  <PendingList>
                    {roster.data.map((item) => (
                      <li key={item.client.id}>
                        <ClientRowLink to={`/clients/${item.client.id}`}>
                          <Avatar aria-hidden>
                            {item.client.username.slice(0, 1).toUpperCase()}
                          </Avatar>
                          <Identity>
                            <ClientName>{item.client.username}</ClientName>
                            <ClientEmail>{item.client.email}</ClientEmail>
                          </Identity>
                          <ChevronRight size={16} color="#9096b6" aria-hidden />
                        </ClientRowLink>
                      </li>
                    ))}
                  </PendingList>
                ) : (
                  <EmptyState>
                    <Users size={18} />
                    {t('contracts.noClients')}
                  </EmptyState>
                )}
              </PendingCard>
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

function formatRequestDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date);
}

function ClientDetail({ item }: { item: ContractClientRoster }) {
  const { t } = useTranslation();
  const notes = item.sessions.filter(
    (session) => session.status === 'INCOMPLETE' && session.stopReason,
  );
  const current = item.assignments.find((assignment) => assignment.isActive);

  return (
    <>
      <PendingCard>
        <SectionTitle>
          <CalendarClock size={18} color="#ffb3b1" />
          {t('contracts.currentPlan')}
        </SectionTitle>
        {current ? (
          <PendingItem>
            <Identity>
              <ClientName>{current.routine?.name ?? current.routineId}</ClientName>
              <DateRange>
                {current.startDate} – {current.endDate}
              </DateRange>
            </Identity>
            <MetaGroup>
              <PeriodPill>{t(`workouts.periods.${current.period}`)}</PeriodPill>
            </MetaGroup>
            <Actions>
              <OutlinedLink to={`/workout/${current.routineId}`}>
                {t('contracts.viewPlan')}
              </OutlinedLink>
              <PrimaryLink to={`/workout/${current.routineId}/edit`}>
                {t('contracts.editPlan')}
              </PrimaryLink>
            </Actions>
          </PendingItem>
        ) : (
          <EmptyState>
            <CalendarClock size={18} />
            {t('contracts.noCurrentPlan')}
          </EmptyState>
        )}
      </PendingCard>
      <PendingCard>
        <SectionTitle>
          <History size={18} color="#ffb3b1" />
          {t('contracts.history')}
          {item.assignments.length ? <CountBadge>{item.assignments.length}</CountBadge> : null}
        </SectionTitle>
        {item.assignments.length ? (
          <PendingList>
            {item.assignments.map((assignment) => (
              <PendingItem key={assignment.id}>
                <Identity>
                  <ClientName>{assignment.routine?.name ?? assignment.routineId}</ClientName>
                  <DateRange>
                    {assignment.startDate} – {assignment.endDate}
                  </DateRange>
                </Identity>
                <MetaGroup>
                  <PeriodPill>{t(`workouts.periods.${assignment.period}`)}</PeriodPill>
                </MetaGroup>
                <Actions>
                  <OutlinedLink to={`/workout/${assignment.routineId}`}>
                    {t('contracts.viewPlan')}
                  </OutlinedLink>
                </Actions>
              </PendingItem>
            ))}
          </PendingList>
        ) : (
          <EmptyState>
            <History size={18} />
            {t('contracts.noHistory')}
          </EmptyState>
        )}
      </PendingCard>
      <PendingCard>
        <SectionTitle>
          <NotebookPen size={18} color="#ffb3b1" />
          {t('contracts.notes')}
          {notes.length ? <CountBadge>{notes.length}</CountBadge> : null}
        </SectionTitle>
        {notes.length ? (
          <PendingList>
            {notes.map((session) => (
              <PendingItem key={session.id}>
                <DatePill>{session.weekStartDate}</DatePill>
                <MessageNote>{session.stopReason}</MessageNote>
              </PendingItem>
            ))}
          </PendingList>
        ) : (
          <EmptyState>
            <NotebookPen size={18} />
            {t('contracts.noNotes')}
          </EmptyState>
        )}
      </PendingCard>
    </>
  );
}

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const PendingCard = styled(CardSurface)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CountBadge = styled.span`
  min-width: 1.5rem;
  padding: 0.1rem 0.45rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ffb3b1, #ff535a);
  color: #1b0d12;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
`;

const PendingList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const itemSurface = `
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(126, 136, 175, 0.16);
  background: #181a2e;
`;

const PendingItem = styled.li`
  ${itemSurface}
`;

const ClientRowLink = styled(Link)`
  ${itemSurface}
  text-decoration: none;
  transition: border-color 150ms ease, background 150ms ease;

  &:hover {
    border-color: rgba(255, 179, 177, 0.4);
    background: rgba(255, 83, 90, 0.08);
  }
`;

const Avatar = styled.div`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ffb3b1, #ff535a);
  color: #1b0d12;
  font-size: 1rem;
  font-weight: 700;
`;

const Identity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 9rem;
`;

const DateRange = styled.span`
  color: #9096b6;
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
`;

const DatePill = styled.span`
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
  border: 1px solid rgba(126, 136, 175, 0.24);
  background: rgba(126, 136, 175, 0.12);
  color: #cfd3ea;
  font-size: 0.72rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const ClientName = styled.span`
  color: #f5f6ff;
  font-size: 0.95rem;
  font-weight: 600;
`;

const ClientEmail = styled.span`
  color: #9096b6;
  font-size: 0.78rem;
`;

const MetaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const PeriodPill = styled.span`
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 179, 177, 0.3);
  background: rgba(255, 83, 90, 0.12);
  color: #ffb3b1;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const RequestedAt = styled.span`
  color: #9096b6;
  font-size: 0.75rem;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.95rem;
  border-radius: 0.7rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 150ms ease, background 150ms ease;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const AcceptButton = styled(ActionButton)`
  border: none;
  background: linear-gradient(135deg, #ffb3b1, #ff535a);
  color: #1b0d12;

  &:hover:not(:disabled) {
    opacity: 0.88;
  }
`;

const RejectButton = styled(ActionButton)`
  border: 1px solid rgba(126, 136, 175, 0.3);
  background: transparent;
  color: #cfd3ea;

  &:hover:not(:disabled) {
    background: rgba(126, 136, 175, 0.12);
  }
`;

const linkButton = `
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.95rem;
  border-radius: 0.7rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 150ms ease, background 150ms ease;
`;

const PrimaryLink = styled(Link)`
  ${linkButton}
  background: linear-gradient(135deg, #ffb3b1, #ff535a);
  color: #1b0d12;

  &:hover {
    opacity: 0.88;
  }
`;

const OutlinedLink = styled(Link)`
  ${linkButton}
  border: 1px solid rgba(126, 136, 175, 0.3);
  color: #cfd3ea;

  &:hover {
    background: rgba(126, 136, 175, 0.12);
  }
`;

const EmptyState = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 1.1rem 1rem;
  border-radius: 1rem;
  border: 1px dashed rgba(126, 136, 175, 0.25);
  color: #9096b6;
  font-size: 0.85rem;
`;

const MessageNote = styled.p`
  flex: 1 1 100%;
  margin: 0;
  padding: 0.7rem 0.85rem;
  border-radius: 0.7rem;
  background: rgba(126, 136, 175, 0.1);
  color: #cfd3ea;
  font-size: 0.85rem;
  line-height: 1.4;
`;

const ErrorText = styled.p`
  color: #ffb4ab;
`;

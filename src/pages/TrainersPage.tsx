import { Inbox, Send, UserRound, X, Dumbbell } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { EntitlementGraceWarning } from '../components/entitlements/EntitlementGraceWarning';
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
import {
  useContractTrainers,
  useCreateContract,
  useMyContracts,
  useRespondContract,
} from '../hooks/useContracts';
import { useEntitlements } from '../hooks/usePermissions';
import { getApiErrorMessage } from '../services/api/errors';
import { WORKOUT_PERIODS, type WorkoutPeriod } from '../services/api/workouts';
import type { ContractStatus } from '../services/api/contracts';

/** Client directory of trainers plus contract request / cancel actions. */
export default function TrainersPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const trainers = useContractTrainers(user?.role?.name === 'Client');
  const contracts = useMyContracts(user?.role?.name === 'Client');
  const create = useCreateContract();
  const { cancel, end } = useRespondContract();
  const { data: entitlements } = useEntitlements();
  const [trainerId, setTrainerId] = useState('');
  const [period, setPeriod] = useState<WorkoutPeriod>('MONTH');
  const [customEndDate, setCustomEndDate] = useState('');
  const [message, setMessage] = useState('');
  const username = user?.username ?? 'Alex';
  const canRequest =
    !entitlements?.isCoveredClient &&
    Boolean(trainerId) && (period !== 'CUSTOM' || Boolean(customEndDate)) && !create.isPending;

  const request = () => {
    if (!canRequest) {
      return;
    }
    create.mutate(
      {
        trainerId,
        period,
        customEndDate: period === 'CUSTOM' ? customEndDate : undefined,
        message: message.trim() || undefined,
      },
      {
        onSuccess: () => setMessage(''),
        onError: (error) => toast.error(getApiErrorMessage(error, t('contracts.requestFailed'))),
      },
    );
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
          <EntitlementGraceWarning />
          <StyledCard>
            <SectionTitle>
              <Send size={18} color="#ffb3b1" />
              {t('contracts.requestTitle')}
            </SectionTitle>
            {trainers.data?.length ? (
              <PendingList>
                {trainers.data.map((trainer) => (
                  <TrainerChoice
                    key={trainer.id}
                    type="button"
                    $selected={trainerId === trainer.id}
                    onClick={() => setTrainerId(trainer.id)}
                    data-testid={`trainer-choice-${trainer.id}`}
                  >
                    <PhotosGroup>
                      {trainer.avatarUrl ? (
                        <AvatarImage src={trainer.avatarUrl} alt={trainer.username} />
                      ) : (
                        <Avatar aria-hidden>{trainer.username.slice(0, 1).toUpperCase()}</Avatar>
                      )}
                      {trainer.trainerProfile?.logoUrl ? (
                        <LogoImage src={trainer.trainerProfile.logoUrl} alt={`${trainer.username} logo`} />
                      ) : (
                        <LogoPlaceholder aria-hidden title="Trainer logo">
                          <Dumbbell size={15} color="#ff9da4" />
                        </LogoPlaceholder>
                      )}
                    </PhotosGroup>
                    <Identity>
                      <Name>{trainer.username}</Name>
                      <Email>{trainer.email}</Email>
                      {trainer.trainerProfile?.description ? (
                        <TrainerBio>{trainer.trainerProfile.description}</TrainerBio>
                      ) : null}
                    </Identity>
                    {trainer.trainerProfile ? (
                      <TrainerPills>
                        <PriceTagBadge>${trainer.trainerProfile.monthlyPrice} USD/mo</PriceTagBadge>
                        {trainer.trainerProfile.specializations?.slice(0, 2).map((s) => (
                          <MiniTag key={s}>{s}</MiniTag>
                        ))}
                      </TrainerPills>
                    ) : null}
                  </TrainerChoice>
                ))}
              </PendingList>
            ) : (
              <EmptyState>
                <UserRound size={18} />
                {t('contracts.selectTrainer')}
              </EmptyState>
            )}
            <PeriodRow>
              {WORKOUT_PERIODS.map((item) => (
                <PeriodChip
                  key={item}
                  type="button"
                  $active={period === item}
                  onClick={() => setPeriod(item)}
                >
                  {t(`workouts.periods.${item}`)}
                </PeriodChip>
              ))}
            </PeriodRow>
            {period === 'CUSTOM' ? (
              <DateInput
                type="date"
                value={customEndDate}
                onChange={(event) => setCustomEndDate(event.target.value)}
              />
            ) : null}
            <FieldGroup>
              <FieldLabel htmlFor="contract-message">{t('contracts.messageLabel')}</FieldLabel>
              <MessageInput
                id="contract-message"
                value={message}
                maxLength={280}
                rows={3}
                placeholder={t('contracts.messagePlaceholder')}
                onChange={(event) => setMessage(event.target.value)}
              />
            </FieldGroup>
            <SendButton type="button" onClick={request} disabled={!canRequest}>
              <Send size={15} />
              {t('contracts.sendRequest')}
            </SendButton>
            {entitlements?.isCoveredClient ? <ErrorText>{t('entitlements.coveredContract')}</ErrorText> : null}
          </StyledCard>
          <StyledCard>
            <SectionTitle>
              <Inbox size={18} color="#ffb3b1" />
              {t('contracts.myContracts')}
              {contracts.data?.length ? <CountBadge>{contracts.data.length}</CountBadge> : null}
            </SectionTitle>
            {contracts.data?.length ? (
              <PendingList>
                {contracts.data.map((contract) => {
                  const name = contract.trainer?.username ?? contract.trainerId;
                  const busy = cancel.isPending && cancel.variables === contract.id;

                  return (
                    <PendingItem key={contract.id}>
                      <PhotosGroup>
                        {contract.trainer?.avatarUrl ? (
                          <AvatarImage src={contract.trainer.avatarUrl} alt={name} />
                        ) : (
                          <Avatar aria-hidden>{name.slice(0, 1).toUpperCase()}</Avatar>
                        )}
                        {contract.trainer?.trainerProfile?.logoUrl ? (
                          <LogoImage src={contract.trainer.trainerProfile.logoUrl} alt={`${name} logo`} />
                        ) : null}
                      </PhotosGroup>
                      <Identity>
                        <Name>{name}</Name>
                        {contract.trainer?.email ? <Email>{contract.trainer.email}</Email> : null}
                      </Identity>
                      <MetaGroup>
                        <PeriodPill>{t(`workouts.periods.${contract.period}`)}</PeriodPill>
                        <StatusPill $status={contract.status}>
                          {t(`contracts.status.${contract.status}`)}
                        </StatusPill>
                        <RequestedAt>
                          {t('contracts.requested', {
                            date: formatRequestDate(contract.createdAt, i18n.language),
                          })}
                        </RequestedAt>
                      </MetaGroup>
                      {contract.status === 'PENDING' ? (
                        <Actions>
                          <RejectButton
                            type="button"
                            disabled={busy}
                            onClick={() => cancel.mutate(contract.id)}
                          >
                            <X size={15} />
                            {t('contracts.cancel')}
                          </RejectButton>
                        </Actions>
                      ) : contract.status === 'ACCEPTED' ? (
                        <Actions>
                          <RejectButton
                            type="button"
                            disabled={end.isPending && end.variables === contract.id}
                            onClick={() => end.mutate(contract.id, {
                              onError: (error) => toast.error(getApiErrorMessage(error, t('contracts.endFailed'))),
                            })}
                          >
                            <X size={15} />
                            {t('contracts.end')}
                          </RejectButton>
                        </Actions>
                      ) : null}
                      {contract.message ? <MessageNote>{contract.message}</MessageNote> : null}
                    </PendingItem>
                  );
                })}
              </PendingList>
            ) : (
              <EmptyState>
                <Inbox size={18} />
                {t('contracts.noContracts')}
              </EmptyState>
            )}
          </StyledCard>
        </SettingsContent>
      </SettingsMain>
    </SettingsPageShell>
  );
}

/** Formats a contract createdAt timestamp for the requested-on label. */
function formatRequestDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date);
}

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const StyledCard = styled(CardSurface)`
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

const PendingList = styled.div`
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
`;

const PendingItem = styled.div`
  ${itemSurface}
  border: 1px solid rgba(126, 136, 175, 0.16);
  background: #181a2e;
`;

const TrainerChoice = styled.button<{ $selected: boolean }>`
  ${itemSurface}
  width: 100%;
  border: 1px solid
    ${({ $selected }) =>
      $selected ? 'rgba(255, 179, 177, 0.55)' : 'rgba(126, 136, 175, 0.16)'};
  background: ${({ $selected }) =>
    $selected ? 'rgba(255, 83, 90, 0.12)' : '#181a2e'};
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
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

const Name = styled.span`
  color: #f5f6ff;
  font-size: 0.95rem;
  font-weight: 600;
`;

const Email = styled.span`
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

const StatusPill = styled(PeriodPill)<{ $status: ContractStatus }>`
  border-color: ${({ $status }) =>
    $status === 'ACCEPTED'
      ? 'rgba(126, 201, 166, 0.35)'
      : $status === 'PENDING'
        ? 'rgba(255, 179, 177, 0.3)'
        : 'rgba(126, 136, 175, 0.3)'};
  background: ${({ $status }) =>
    $status === 'ACCEPTED'
      ? 'rgba(126, 201, 166, 0.12)'
      : $status === 'PENDING'
        ? 'rgba(255, 83, 90, 0.12)'
        : 'rgba(126, 136, 175, 0.12)'};
  color: ${({ $status }) =>
    $status === 'ACCEPTED' ? '#9ee0c0' : $status === 'PENDING' ? '#ffb3b1' : '#9096b6'};
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

const SendButton = styled(ActionButton)`
  align-self: flex-start;
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

const PeriodRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const PeriodChip = styled.button<{ $active: boolean }>`
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'rgba(255, 179, 177, 0.45)' : 'rgba(126, 136, 175, 0.2)'};
  background: ${({ $active }) => ($active ? 'linear-gradient(135deg, #ffb3b1, #ff535a)' : '#181a2e')};
  color: ${({ $active }) => ($active ? '#1b0d12' : '#cfd3ea')};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
`;

const DateInput = styled.input`
  align-self: flex-start;
  padding: 0.55rem 0.8rem;
  border: none;
  border-radius: 0.7rem;
  background: #181a2e;
  color: #e0e0fc;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px #ffb3b1;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const FieldLabel = styled.label`
  color: #9096b6;
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
`;

const MessageInput = styled.textarea`
  resize: vertical;
  min-height: 5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.7rem;
  background: #181a2e;
  color: #e0e0fc;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px #ffb3b1;
  }
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

const ErrorText = styled.p`
  margin: 0;
  color: #ffb4ab;
`;

const PhotosGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AvatarImage = styled.img`
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 9999px;
  object-fit: cover;
  border: 1.5px solid #ef233c;
  background: #2c3357;
`;

const LogoImage = styled.img`
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.5rem;
  object-fit: cover;
  border: 1.5px solid #ffb3b1;
  background: #1b203d;
`;

const LogoPlaceholder = styled.div`
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.5rem;
  border: 1px dashed rgba(255, 179, 177, 0.4);
  background: rgba(255, 83, 90, 0.08);
  display: grid;
  place-items: center;
`;

const TrainerBio = styled.span`
  color: #c0c5e4;
  font-size: 0.78rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 24rem;
`;

const TrainerPills = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
  flex-wrap: wrap;
`;

const PriceTagBadge = styled.span`
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  background: rgba(239, 35, 60, 0.15);
  border: 1px solid rgba(239, 35, 60, 0.35);
  color: #ff9da4;
  font-size: 0.75rem;
  font-weight: 700;
`;

const MiniTag = styled.span`
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  background: rgba(126, 136, 175, 0.12);
  border: 1px solid rgba(126, 136, 175, 0.2);
  color: #e0e0fc;
  font-size: 0.7rem;
  font-weight: 500;
`;

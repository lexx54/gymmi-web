import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ChevronRight, Clock, QrCode, Trophy } from 'lucide-react';
import {
  Avatar,
  CountBadge,
  GhostButton,
  MOCK,
  Meta,
  Name,
  Panel,
  PanelTitle,
  PhoneFrame,
  Pill,
  PrimaryButton,
  ProgressFill,
  ProgressTrack,
  Row,
  Sub,
  WebBody,
  WebFrame,
  WebTitle,
  WebTopBar,
} from './mockupStyles';

const ROSTER = [
  { initials: 'SM', name: 'sarah_m', email: 'sarah@example.com' },
  { initials: 'DK', name: 'davidkim', email: 'david@example.com' },
];
const PENDING_CLIENT = { initials: 'LP', name: 'laura.perez', email: 'laura@example.com' };

/** Mirrors the web trainer `ClientsPage`: seat hint, pending requests, plain roster list. */
export function ClientsPageMockup() {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);
  const roster = accepted ? [...ROSTER, PENDING_CLIENT] : ROSTER;

  return (
    <WebFrame data-testid="clients-page-mockup">
      <WebTopBar>
        <WebTitle>{t('nav.clients')}</WebTitle>
        <Pill>{t('entitlements.seatUsage', { usage: roster.length, limit: 15 })}</Pill>
      </WebTopBar>
      <WebBody>
        <Sub>{t('entitlements.trainerSeats')}</Sub>
        <Panel>
          <PanelTitle>
            {t('contracts.pending')}
            <CountBadge>{accepted ? 0 : 1}</CountBadge>
          </PanelTitle>
          {accepted ? (
            <Sub>{t('contracts.noPending')}</Sub>
          ) : (
            <Row>
              <Avatar>{PENDING_CLIENT.initials}</Avatar>
              <Meta>
                <Name>{PENDING_CLIENT.name}</Name>
                <Sub>{t('landing.mock.requestedBy')}</Sub>
              </Meta>
              <Pill>{t('workouts.periods.MONTH')}</Pill>
              <PrimaryButton type="button" onClick={() => setAccepted(true)}>
                {t('contracts.accept')}
              </PrimaryButton>
            </Row>
          )}
        </Panel>
        <Panel>
          <PanelTitle>{t('contracts.roster')}</PanelTitle>
          {roster.map((client) => (
            <Row key={client.name}>
              <Avatar>{client.initials}</Avatar>
              <Meta>
                <Name>{client.name}</Name>
                <Sub>{client.email}</Sub>
              </Meta>
              <ChevronRight size={15} color={MOCK.faint} />
            </Row>
          ))}
        </Panel>
      </WebBody>
    </WebFrame>
  );
}

/** Mirrors the mobile `HomeScreen` for a client with an assigned routine. */
export function MobileHomeMockup() {
  const { t } = useTranslation();
  const completed = 2;
  const total = 3;
  const percent = Math.round((completed / total) * 100);
  const activity = [
    { day: 3, exercises: 5, when: t('landing.mock.today') },
    { day: 1, exercises: 4, when: t('landing.mock.yesterday') },
  ];

  return (
    <PhoneFrame data-testid="mobile-home-mockup">
      <Greeting>{t('landing.mock.greeting')}</Greeting>
      <Username>sarah_m</Username>

      <WeeklyCard>
        <Watermark aria-hidden>{percent}%</Watermark>
        <CardLabel>{t('landing.mock.weeklyProgress')}</CardLabel>
        <CardValue>{t('landing.mock.workoutsCompleted', { completed, total })}</CardValue>
        <SegmentRow>
          {Array.from({ length: total }, (_, i) => (
            <SegmentPill key={i} $done={i < completed} />
          ))}
        </SegmentRow>
      </WeeklyCard>

      <StatGrid>
        <StatCard>
          <Clock size={16} color={MOCK.sky} />
          <small>{t('landing.mock.totalTime')}</small>
          <strong>3h 20m</strong>
        </StatCard>
        <StatCard>
          <Trophy size={16} color={MOCK.gold} />
          <small>{t('landing.mock.streak')}</small>
          <strong>{t('landing.mock.streakDays', { count: 5 })}</strong>
        </StatCard>
      </StatGrid>

      <SectionLabel>{t('landing.mock.recentActivity')}</SectionLabel>
      {activity.map((item) => (
        <ActivityRow key={item.day}>
          <DayBadge>{t(`workouts.weekdays.${item.day}`)}</DayBadge>
          <Meta>
            <Name>{t('landing.mock.exerciseCount', { count: item.exercises })}</Name>
            <Sub>{item.when}</Sub>
          </Meta>
          <Pill $color={MOCK.green}>{t('landing.mock.completed')}</Pill>
        </ActivityRow>
      ))}
    </PhoneFrame>
  );
}

/** Mirrors the web gym "Gym Members Roster" page. */
export function GymMembersMockup() {
  const { t } = useTranslation();
  const [members, setMembers] = useState(74);
  const [pending, setPending] = useState(true);
  const capacity = 100;
  const percent = Math.round((members / capacity) * 100);

  const resolve = (approve: boolean) => {
    if (approve) setMembers((n) => n + 1);
    setPending(false);
  };

  return (
    <WebFrame data-testid="gym-members-mockup">
      <WebTopBar>
        <WebTitle>{t('gym.membersTitle')}</WebTitle>
        <QrButton>
          <QrCode size={13} /> {t('landing.mock.joinCodeButton')}
        </QrButton>
      </WebTopBar>
      <WebBody>
        <Panel>
          <CapacityHead>
            <span>{t('gym.capacity')}</span>
            <strong>
              {t('gym.capacityProgress', { current: members, max: capacity })} ({percent}%)
            </strong>
          </CapacityHead>
          <ProgressTrack>
            <ProgressFill $percent={percent} />
          </ProgressTrack>
        </Panel>

        <Panel>
          <PanelTitle>
            {t('gym.pendingMemberRequests')}
            <CountBadge>{pending ? 1 : 0}</CountBadge>
          </PanelTitle>
          {pending && (
            <Row>
              <Avatar>LP</Avatar>
              <Meta>
                <Name>Laura Pérez</Name>
                <Sub>{t('gym.pendingRequestFor')}</Sub>
              </Meta>
              <GhostButton type="button" onClick={() => resolve(false)}>
                {t('contracts.reject')}
              </GhostButton>
              <PrimaryButton type="button" onClick={() => resolve(true)}>
                {t('landing.mock.approve')}
              </PrimaryButton>
            </Row>
          )}
        </Panel>

        <Panel>
          <Row>
            <Avatar>DK</Avatar>
            <Meta>
              <Name>David Kim</Name>
              <Sub>david@example.com</Sub>
            </Meta>
            <Pill $color={MOCK.sky}>{t('landing.mock.goalStrength')}</Pill>
          </Row>
          <Row>
            <Avatar>AR</Avatar>
            <Meta>
              <Name>Ana Rivas</Name>
              <Sub>ana@example.com</Sub>
            </Meta>
            <Pill $color={MOCK.amber}>{t('landing.mock.goalFatLoss')}</Pill>
          </Row>
        </Panel>
        <JoinCode>
          {t('gym.joinCode')}: <strong>GYM-7Q4K</strong>
        </JoinCode>
      </WebBody>
    </WebFrame>
  );
}

const Greeting = styled.div`
  font-size: 0.75rem;
  color: ${MOCK.muted};
`;

const Username = styled.div`
  margin-bottom: 0.85rem;
  font-size: 1.2rem;
  font-weight: 800;
`;

const WeeklyCard = styled.div`
  position: relative;
  overflow: hidden;
  padding: 0.95rem;
  border-radius: 1.1rem;
  background: linear-gradient(135deg, ${MOCK.coral} 0%, #c81d3a 100%);
  margin-bottom: 0.7rem;
`;

const Watermark = styled.span`
  position: absolute;
  top: 50%;
  right: 0.6rem;
  transform: translateY(-50%);
  font-size: 2.6rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.16);
`;

const CardLabel = styled.div`
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
`;

const CardValue = styled.div`
  max-width: 68%;
  margin: 0.25rem 0 0.6rem;
  font-size: 0.9rem;
  font-weight: 800;
`;

const SegmentRow = styled.div`
  max-width: 68%;
  display: flex;
  gap: 0.3rem;
`;

const SegmentPill = styled.span<{ $done: boolean }>`
  flex: 1;
  height: 0.35rem;
  border-radius: 999px;
  background: ${({ $done }) => ($done ? '#fff' : 'rgba(255,255,255,0.3)')};
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.7rem;
  border-radius: 0.9rem;
  background: ${MOCK.card};
  small {
    font-size: 0.62rem;
    color: ${MOCK.muted};
  }
  strong {
    font-size: 0.9rem;
  }
`;

const SectionLabel = styled.div`
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
  font-weight: 800;
`;

const ActivityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.8rem;
  background: ${MOCK.card};
  & + & {
    margin-top: 0.35rem;
  }
`;

const DayBadge = styled.span`
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.6rem;
  background: rgba(255, 79, 94, 0.14);
  color: ${MOCK.coral};
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
`;

const QrButton = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  background: ${MOCK.red};
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  white-space: nowrap;
`;

const CapacityHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${MOCK.muted};
  strong {
    color: ${MOCK.white};
  }
`;

const JoinCode = styled.div`
  font-size: 0.7rem;
  color: ${MOCK.muted};
  strong {
    color: ${MOCK.white};
    letter-spacing: 0.08em;
  }
`;

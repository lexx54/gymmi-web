import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Layers } from 'lucide-react';
import {
  Avatar,
  MOCK,
  Meta,
  Name,
  Panel,
  Pill,
  Sub,
  WebBody,
  WebFrame,
  WebTitle,
  WebTopBar,
  pickLang,
} from './mockupStyles';

const COACHES = [
  {
    id: 'as',
    initials: 'AS',
    name: 'Alex Sterling',
    price: 40,
    tags: [{ en: 'Strength', es: 'Fuerza' }, { en: 'Powerlifting', es: 'Powerlifting' }],
  },
  {
    id: 'mt',
    initials: 'MT',
    name: 'Mike Torres',
    price: 30,
    tags: [{ en: 'Hypertrophy', es: 'Hipertrofia' }, { en: 'Mobility', es: 'Movilidad' }],
  },
];

/** Mirrors the web gym "Affiliated Coaches Management" page and the catalog usage pill (Gym Plus: 3 workouts). */
export function GymCoachesMockup() {
  const { t, i18n } = useTranslation();
  const [canPublish, setCanPublish] = useState<Record<string, boolean>>({ as: true, mt: false });

  return (
    <WebFrame data-testid="gym-coaches-mockup">
      <WebTopBar>
        <WebTitle>{t('gym.coachesTitle')}</WebTitle>
        <Pill $color={MOCK.amber}>{t('landing.mock.trialActive')}</Pill>
      </WebTopBar>
      <WebBody>
        <Stats>
          <Pill $color={MOCK.green}>{t('landing.mock.approvedCoaches', { count: 2 })}</Pill>
          <Pill $color={MOCK.amber}>{t('landing.mock.pendingCoaches', { count: 1 })}</Pill>
        </Stats>

        {COACHES.map((coach) => (
          <Panel key={coach.id}>
            <Head>
              <Avatar $color="#3b2050">{coach.initials}</Avatar>
              <Meta>
                <Name>{coach.name}</Name>
                <Sub>
                  ${coach.price} {t('landing.mock.perMonth')}
                </Sub>
              </Meta>
            </Head>
            <Tags>
              {coach.tags.map((tag) => (
                <Pill key={tag.en} $color={MOCK.muted}>
                  {pickLang(i18n.language, tag)}
                </Pill>
              ))}
            </Tags>
            <ToggleRow>
              <span>{t('gym.canPublishRoutines')}</span>
              <Switch
                type="button"
                role="switch"
                aria-checked={canPublish[coach.id]}
                aria-label={`${t('gym.canPublishRoutines')}: ${coach.name}`}
                $on={canPublish[coach.id]}
                onClick={() => setCanPublish((prev) => ({ ...prev, [coach.id]: !prev[coach.id] }))}
              />
            </ToggleRow>
          </Panel>
        ))}

        <Catalog>
          <Layers size={14} color={MOCK.pink} />
          {t('gym.catalogUsage', { usage: 2, limit: 3 })}
        </Catalog>
      </WebBody>
    </WebFrame>
  );
}

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin: 0.55rem 0;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.55rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.72rem;
  font-weight: 700;
  color: ${MOCK.text};
`;

const Switch = styled.button<{ $on: boolean }>`
  position: relative;
  width: 2.3rem;
  height: 1.3rem;
  border: none;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? MOCK.red : MOCK.cardHigh)};
  cursor: pointer;
  transition: background 0.2s ease;
  &::after {
    content: '';
    position: absolute;
    top: 0.15rem;
    left: ${({ $on }) => ($on ? '1.15rem' : '0.15rem')};
    width: 1rem;
    height: 1rem;
    border-radius: 999px;
    background: #fff;
    transition: left 0.2s ease;
  }
`;

const Catalog = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.7rem;
  border: 1px dashed rgba(255, 179, 177, 0.35);
  font-size: 0.72rem;
  font-weight: 700;
  color: ${MOCK.pink};
`;

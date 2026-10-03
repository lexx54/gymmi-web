import { Settings, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CardSurface, SectionTitle } from './SettingsShell';
import { useAuth } from '../../context/AuthContext';
import { resetUserTour } from '../../services/storage/tourStorage';

/**
 * Data management and connected services section with last sync indicator and tour replay.
 */
export function DataManagementCard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRestartTour = () => {
    resetUserTour(user?.id);
    navigate('/dashboard');
  };

  return (
    <Wrapper>
      <HeaderRow>
        <SectionTitle>
          <Settings size={18} color="#ffb3b1" /> {t('settings.dataManagement')}
        </SectionTitle>
        <SyncBadge>{t('settings.lastSync')}</SyncBadge>
      </HeaderRow>
      <ActionRow>
        <TourText>
          {t('tour.restartTourDescription', {
            defaultValue: 'Replay the interactive guided tour for your account role.',
          })}
        </TourText>
        <RestartTourBtn
          type="button"
          onClick={handleRestartTour}
          data-testid="restart-tour-btn"
        >
          <Sparkles size={15} />
          <span>{t('tour.restartTour', { defaultValue: 'Restart Tour' })}</span>
        </RestartTourBtn>
      </ActionRow>
    </Wrapper>
  );
}

const Wrapper = styled(CardSurface)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SyncBadge = styled.span`
  padding: 0.35rem 0.85rem;
  border-radius: 0.4rem;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.35);
  color: #ff535a;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const TourText = styled.p`
  margin: 0;
  font-size: 0.84rem;
  color: #c0c5e4;
`;

const RestartTourBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.35);
  border-radius: 0.6rem;
  color: #ff8a93;
  padding: 0.5rem 0.95rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 140ms ease;

  &:hover {
    background: rgba(239, 35, 60, 0.22);
    color: #ffffff;
    transform: translateY(-1px);
  }
`;

import { X, Eye, Dumbbell, Building, Tag, ShieldCheck } from 'lucide-react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import type { FullUserProfile } from '../../types/auth';

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: FullUserProfile | null;
}

/**
 * Interactive popup modal rendering the Personal Trainer's public profile card
 * exactly as prospective clients see it when searching for coaches.
 */
export function PublicProfileModal({ isOpen, onClose, userProfile }: PublicProfileModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const tp = userProfile?.trainerProfile;
  const username = userProfile?.username || t('settings.displayName');
  const avatarUrl = userProfile?.avatarUrl;
  const logoUrl = tp?.logoUrl;
  const price = tp?.monthlyPrice ?? 0;
  const specializations = tp?.specializations ?? [];
  const gyms = tp?.gyms ?? [];
  const description = tp?.description || t('settings.noBio');

  return (
    <Overlay
      data-testid="public-profile-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <ModalCard data-testid="public-profile-modal">
        <ModalHeader>
          <PreviewBadge>
            <Eye size={14} color="#ffb3b1" />
            <span>{t('settings.publicProfilePreview') || 'PUBLIC PROFILE PREVIEW'}</span>
          </PreviewBadge>
          <CloseButton
            type="button"
            onClick={onClose}
            aria-label={t('common.close') || 'Close'}
            data-testid="close-public-profile-modal"
          >
            <X size={18} />
          </CloseButton>
        </ModalHeader>

        <NoticeText>
          {t('settings.publicProfileNotice') ||
            'This is how athletes see your coaching profile when browsing trainers to request contracts.'}
        </NoticeText>

        <TrainerPreviewCard>
          <TrainerCardHeader>
            <PhotosRow>
              <AvatarContainer>
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={username} />
                ) : (
                  <AvatarFallback>{(username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                )}
                <PhotoLabel>{t('settings.profilePhoto') || 'Profile Photo'}</PhotoLabel>
              </AvatarContainer>

              {logoUrl ? (
                <LogoContainer>
                  <LogoImage src={logoUrl} alt={`${username} Logo`} />
                  <PhotoLabel>{t('settings.trainerLogo') || 'Coach Logo'}</PhotoLabel>
                </LogoContainer>
              ) : (
                <LogoContainer>
                  <LogoFallback>
                    <Dumbbell size={22} color="#ff9da4" />
                  </LogoFallback>
                  <PhotoLabel>{t('settings.trainerLogo') || 'Coach Logo'}</PhotoLabel>
                </LogoContainer>
              )}
            </PhotosRow>

            <TrainerMeta>
              <TrainerName>{username}</TrainerName>
              <RolePill>
                <ShieldCheck size={13} />
                <span>{t('settings.personalTrainer') || 'Personal Trainer'}</span>
              </RolePill>
              <PriceTag>${price} USD <PricePeriod>/ {t('workouts.periods.MONTH') || 'Month'}</PricePeriod></PriceTag>
            </TrainerMeta>
          </TrainerCardHeader>

          <SectionBlock>
            <SectionLabel>{t('auth.servicesDescription') || 'About & Coaching Style'}</SectionLabel>
            <DescriptionBox>{description}</DescriptionBox>
          </SectionBlock>

          {specializations.length > 0 && (
            <SectionBlock>
              <SectionLabel>{t('auth.specializations') || 'Specialties'}</SectionLabel>
              <ChipsList>
                {specializations.map((spec) => (
                  <SpecChip key={spec}>
                    <Tag size={12} />
                    <span>{spec}</span>
                  </SpecChip>
                ))}
              </ChipsList>
            </SectionBlock>
          )}

          {gyms.length > 0 && (
            <SectionBlock>
              <SectionLabel>{t('auth.gymAffiliations') || 'Gym Affiliations'}</SectionLabel>
              <ChipsList>
                {gyms.map((gym) => (
                  <GymChip key={gym}>
                    <Building size={13} />
                    <span>{gym}</span>
                  </GymChip>
                ))}
              </ChipsList>
            </SectionBlock>
          )}

          <ClientActionSimulation>
            <SimulatedButton disabled type="button">
              {t('contracts.sendRequest') || 'Request Contract'}
            </SimulatedButton>
            <SimulationHint>
              {t('settings.simulationHint') || 'Athletes select a contract duration (1 week to 3 months) to request your coaching.'}
            </SimulationHint>
          </ClientActionSimulation>
        </TrainerPreviewCard>
      </ModalCard>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(8, 10, 22, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalCard = styled.div`
  background: #121528;
  border: 1px solid rgba(255, 179, 177, 0.3);
  border-radius: 1.25rem;
  width: 100%;
  max-width: 38rem;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.75rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(239, 35, 60, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PreviewBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  background: rgba(255, 83, 90, 0.12);
  border: 1px solid rgba(255, 179, 177, 0.35);
  color: #ffb3b1;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9096b6;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
`;

const NoticeText = styled.p`
  margin: 0;
  color: #9096b6;
  font-size: 0.82rem;
  line-height: 1.4;
`;

const TrainerPreviewCard = styled.div`
  background: #181a2e;
  border: 1px solid rgba(126, 136, 175, 0.22);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const TrainerCardHeader = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const PhotosRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
`;

const AvatarImage = styled.img`
  width: 4.75rem;
  height: 4.75rem;
  border-radius: 9999px;
  object-fit: cover;
  border: 2px solid #ef233c;
  background: #2c3357;
`;

const AvatarFallback = styled.div`
  width: 4.75rem;
  height: 4.75rem;
  border-radius: 9999px;
  border: 2px solid #ef233c;
  background: linear-gradient(180deg, #2c3357 0%, #1b203d 100%);
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  font-weight: 800;
  color: #ff9da4;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
`;

const LogoImage = styled.img`
  width: 4.75rem;
  height: 4.75rem;
  border-radius: 0.85rem;
  object-fit: cover;
  border: 2px solid #ffb3b1;
  background: #1b203d;
`;

const LogoFallback = styled.div`
  width: 4.75rem;
  height: 4.75rem;
  border-radius: 0.85rem;
  border: 2px solid rgba(255, 179, 177, 0.4);
  background: rgba(255, 83, 90, 0.08);
  display: grid;
  place-items: center;
`;

const PhotoLabel = styled.span`
  font-size: 0.65rem;
  color: #9096b6;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
`;

const TrainerMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const TrainerName = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f5f6ff;
  letter-spacing: -0.02em;
`;

const RolePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #ff9da4;
  font-size: 0.75rem;
  font-weight: 600;
`;

const PriceTag = styled.div`
  margin-top: 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
`;

const PricePeriod = styled.span`
  font-size: 0.82rem;
  font-weight: 500;
  color: #9096b6;
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const SectionLabel = styled.span`
  color: #9096b6;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
`;

const DescriptionBox = styled.p`
  margin: 0;
  color: #c0c5e4;
  font-size: 0.88rem;
  line-height: 1.5;
  background: #121528;
  border: 1px solid rgba(126, 136, 175, 0.15);
  border-radius: 0.75rem;
  padding: 0.85rem 1rem;
  white-space: pre-wrap;
`;

const ChipsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SpecChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  background: rgba(126, 136, 175, 0.14);
  border: 1px solid rgba(126, 136, 175, 0.25);
  color: #e0e0fc;
  font-size: 0.75rem;
  font-weight: 600;
`;

const GymChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  background: rgba(239, 35, 60, 0.15);
  border: 1px solid rgba(239, 35, 60, 0.35);
  color: #ff9da4;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ClientActionSimulation = styled.div`
  border-top: 1px solid rgba(126, 136, 175, 0.16);
  padding-top: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const SimulatedButton = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #ffb3b1, #ff535a);
  border: none;
  color: #1b0d12;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: default;
  opacity: 0.85;
`;

const SimulationHint = styled.span`
  font-size: 0.75rem;
  color: #9096b6;
  text-align: center;
`;

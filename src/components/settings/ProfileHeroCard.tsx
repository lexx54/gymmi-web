import { useState, useRef } from 'react';
import { Pencil, TrendingUp, Dumbbell, Tag as TagIconLucide, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { toast } from 'sonner';
import { CardSurface } from './SettingsShell';
import { PublicProfileModal } from './PublicProfileModal';
import { uploadImageDirectly } from '../../utils/imageUpload';
import { useUpdateUserProfile } from '../../hooks/useUserProfile';
import type { FullUserProfile } from '../../types/auth';

interface ProfileHeroCardProps {
  userProfile?: FullUserProfile | null;
}

/**
 * Profile hero section displaying user identity, avatar, coach logo, bio, tags,
 * workout frequency, and goal progress. Adapts dynamically for Athletes and Personal Trainers.
 */
export function ProfileHeroCard({ userProfile }: ProfileHeroCardProps) {
  const { t } = useTranslation();
  const { mutate: updateProfile } = useUpdateUserProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isTrainer = userProfile?.role?.name === 'Trainer';
  const hasProfile = Boolean(userProfile);

  // Dynamic names and bio
  const displayName = hasProfile ? userProfile?.username : t('settings.displayName');
  const statusLine = hasProfile
    ? isTrainer
      ? t('settings.personalTrainer')
      : t('settings.athlete')
    : t('settings.statusLine');

  const bio = hasProfile
    ? isTrainer
      ? userProfile?.trainerProfile?.description || t('settings.noBio')
      : userProfile?.profile?.goal
        ? `${t('auth.fitnessGoal')}: ${userProfile.profile.goal}`
        : t('settings.bio')
    : t('settings.bio');

  const trainerPrice = userProfile?.trainerProfile?.monthlyPrice ?? 0;
  const trainerSpecs = userProfile?.trainerProfile?.specializations ?? [];
  const clientAge = userProfile?.profile?.age;
  const clientHeight = userProfile?.profile?.height;
  const clientWeight = userProfile?.profile?.weight;

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingAvatar(true);
      const publicUrl = await uploadImageDirectly(file, 'avatar');
      updateProfile(
        { avatarUrl: publicUrl },
        {
          onSuccess: () => {
            toast.success(t('settings.avatarUpdated'));
          },
          onError: (err: any) => {
            toast.error(err?.response?.data?.message || t('common.error'));
          },
          onSettled: () => {
            setIsUploadingAvatar(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
          },
        },
      );
    } catch (err: any) {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
      toast.error(err.message === 'FILE_TOO_LARGE' ? t('auth.fileTooLarge') : t('auth.uploadError'));
    }
  };

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingLogo(true);
      const publicUrl = await uploadImageDirectly(file, 'trainer-logo');
      updateProfile(
        { trainerProfile: { logoUrl: publicUrl } },
        {
          onSuccess: () => {
            toast.success(t('settings.logoUpdated'));
          },
          onError: (err: any) => {
            toast.error(err?.response?.data?.message || t('common.error'));
          },
          onSettled: () => {
            setIsUploadingLogo(false);
            if (logoInputRef.current) logoInputRef.current.value = '';
          },
        },
      );
    } catch (err: any) {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
      toast.error(err.message === 'FILE_TOO_LARGE' ? t('auth.fileTooLarge') : t('auth.uploadError'));
    }
  };

  return (
    <>
      <HeroWrapper data-testid="profile-hero-card">
        <HeroLeft>
          <AvatarSection>
            <PhotosRow>
              <AvatarColumn>
                <AvatarBox>
                  {userProfile?.avatarUrl ? (
                    <AvatarImage
                      src={userProfile.avatarUrl}
                      alt={displayName}
                      data-testid="profile-avatar-img"
                    />
                  ) : (
                    <AvatarPlaceholder>
                      <AvatarInitials>
                        {(displayName || 'U').charAt(0).toUpperCase()}
                      </AvatarInitials>
                    </AvatarPlaceholder>
                  )}
                  <EditBadge
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    aria-label={t('settings.editAvatar')}
                    data-testid="edit-avatar-btn"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 size={11} className="spin" />
                    ) : (
                      <Pencil size={11} />
                    )}
                  </EditBadge>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleAvatarFile}
                    data-testid="avatar-file-input"
                  />
                </AvatarBox>
                <PhotoLabel>{t('settings.profilePhoto')}</PhotoLabel>
              </AvatarColumn>

              {isTrainer && (
                <AvatarColumn>
                  <LogoBox>
                    {userProfile?.trainerProfile?.logoUrl ? (
                      <LogoImage
                        src={userProfile.trainerProfile.logoUrl}
                        alt={`${displayName} Logo`}
                        data-testid="trainer-logo-img"
                      />
                    ) : (
                      <LogoPlaceholder>
                        <Dumbbell size={24} color="#ff9da4" />
                      </LogoPlaceholder>
                    )}
                    <EditBadge
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      aria-label={t('settings.editTrainerLogo')}
                      data-testid="edit-logo-btn"
                    >
                      {isUploadingLogo ? (
                        <Loader2 size={11} className="spin" />
                      ) : (
                        <Pencil size={11} />
                      )}
                    </EditBadge>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      style={{ display: 'none' }}
                      onChange={handleLogoFile}
                      data-testid="logo-file-input"
                    />
                  </LogoBox>
                  <PhotoLabel>{t('settings.trainerLogo')}</PhotoLabel>
                </AvatarColumn>
              )}
            </PhotosRow>
          </AvatarSection>

          <ProfileInfo>
            <DisplayName>{displayName}</DisplayName>
            <StatusLine>{statusLine}</StatusLine>
            <Bio>{bio}</Bio>

            <TagRow>
              {hasProfile && isTrainer ? (
                <>
                  <HighlightTag>
                    <Dumbbell size={12} /> ${trainerPrice} USD/mo
                  </HighlightTag>
                  {trainerSpecs.slice(0, 3).map((spec) => (
                    <Tag key={spec}>
                      <TagIconLucide size={11} /> {spec}
                    </Tag>
                  ))}
                </>
              ) : hasProfile ? (
                <>
                  {clientAge && <Tag>{clientAge} yrs</Tag>}
                  {clientHeight && <Tag>{clientHeight} cm</Tag>}
                  {clientWeight && <Tag>{clientWeight} kg</Tag>}
                  {userProfile?.profile?.goal && (
                    <HighlightTag>{userProfile.profile.goal}</HighlightTag>
                  )}
                </>
              ) : (
                <>
                  <Tag>
                    <TagIcon>&#9878;</TagIcon> {t('settings.endurancePro')}
                  </Tag>
                  <Tag>
                    <TagIcon>&#9201;</TagIcon> {t('settings.marathonPb')}
                  </Tag>
                </>
              )}
            </TagRow>
          </ProfileInfo>
        </HeroLeft>

        <HeroRight>
          <StatBlock>
            <StatHeader>
              <StatLabel>
                {isTrainer ? t('settings.rateLabel') : t('settings.workoutFrequency')}
              </StatLabel>
              <TrendingUp size={16} color="#ffb3b1" />
            </StatHeader>
            <StatValue>
              {isTrainer ? (
                `$${trainerPrice}`
              ) : (
                <>
                  6.4<StatUnit>{t('settings.perWeek')}</StatUnit>
                </>
              )}
            </StatValue>
          </StatBlock>

          <ProgressBlock>
            <ProgressHeader>
              <StatLabel>{t('settings.goalProgress')}</StatLabel>
              <ProgressPercent>84%</ProgressPercent>
            </ProgressHeader>
            <ProgressTrack>
              <ProgressFill style={{ width: '84%' }} />
            </ProgressTrack>
          </ProgressBlock>

          <ViewProfileButton
            type="button"
            onClick={() => setIsModalOpen(true)}
            data-testid="view-public-profile-btn"
          >
            {t('settings.viewPublicProfile')}
          </ViewProfileButton>
        </HeroRight>
      </HeroWrapper>

      <PublicProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userProfile={userProfile}
      />
    </>
  );
}

const HeroWrapper = styled(CardSurface)`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const AvatarSection = styled.div`
  flex-shrink: 0;
`;

const PhotosRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const AvatarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
`;

const PhotoLabel = styled.span`
  font-size: 0.62rem;
  color: #9096b6;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
`;

const AvatarBox = styled.div`
  position: relative;
  width: 5.75rem;
  height: 5.75rem;
  border-radius: 9999px;
  border: 2px solid #ef233c;
  overflow: visible;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  object-fit: cover;
  background: #2c3357;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(180deg, #2c3357 0%, #1b203d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarInitials = styled.span`
  font-size: 2rem;
  font-weight: 800;
  color: #ff9da4;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const LogoBox = styled.div`
  position: relative;
  width: 5.75rem;
  height: 5.75rem;
  border-radius: 0.85rem;
  border: 2px solid #ffb3b1;
  overflow: visible;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  object-fit: cover;
  background: #1b203d;
`;

const LogoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  background: rgba(255, 83, 90, 0.08);
  border: 1px dashed rgba(255, 179, 177, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EditBadge = styled.button`
  position: absolute;
  bottom: -0.25rem;
  right: -0.25rem;
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(135deg, #ffb3b1, #ff535a);
  color: #1a0a0c;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.08);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DisplayName = styled.h2`
  margin: 0;
  font-size: 1.85rem;
  font-weight: 700;
  color: #f5f6ff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.02em;
`;

const StatusLine = styled.p`
  margin: 0;
  color: #9096b6;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
`;

const Bio = styled.p`
  margin: 0;
  color: #c0c5e4;
  font-size: 0.88rem;
  line-height: 1.5;
  max-width: 28rem;
`;

const TagRow = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  border-radius: 9999px;
  background: rgba(126, 136, 175, 0.12);
  border: 1px solid rgba(126, 136, 175, 0.2);
  color: #e0e0fc;
  font-size: 0.75rem;
  font-weight: 500;
`;

const HighlightTag = styled(Tag)`
  background: rgba(239, 35, 60, 0.15);
  border-color: rgba(239, 35, 60, 0.35);
  color: #ff9da4;
  font-weight: 600;
`;

const TagIcon = styled.span`
  font-size: 0.85rem;
`;

const HeroRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 13rem;
`;

const StatBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatLabel = styled.span`
  color: #9096b6;
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
`;

const StatValue = styled.p`
  margin: 0;
  font-size: 2.4rem;
  font-weight: 700;
  color: #f5f6ff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.02em;
  line-height: 1;
`;

const StatUnit = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #9096b6;
`;

const ProgressBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProgressPercent = styled.span`
  color: #f5f6ff;
  font-size: 0.85rem;
  font-weight: 700;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 0.5rem;
  border-radius: 9999px;
  background: #313349;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, #ffb3b1, #ef233c);
`;

const ViewProfileButton = styled.button`
  margin-top: 0.25rem;
  padding: 0.7rem 1.2rem;
  border-radius: 0.6rem;
  border: 1px solid rgba(126, 136, 175, 0.25);
  background: transparent;
  color: #e0e0fc;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: rgba(126, 136, 175, 0.1);
  }
`;

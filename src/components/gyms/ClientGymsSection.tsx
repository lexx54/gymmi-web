import {
  Building2,
  Calendar,
  Check,
  Clock,
  DoorOpen,
  MapPin,
  QrCode,
  Search,
  Send,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import styled from 'styled-components';
import {
  useCancelGymMembershipRequest,
  useJoinGymByCode,
  useLeaveGym,
  useMyMemberships,
  usePublicGyms,
  useRequestGymMembership,
} from '../../hooks/useGyms';
import { getApiErrorMessage } from '../../services/api/errors';
import { CardSurface, SectionTitle } from '../settings/SettingsShell';

export function ClientGymsSection() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const { data: memberships = [] } = useMyMemberships();
  const { data: publicGyms = [], isLoading: gymsLoading } = usePublicGyms({ search });

  const joinByCodeMutation = useJoinGymByCode();
  const requestMembershipMutation = useRequestGymMembership();
  const cancelRequestMutation = useCancelGymMembershipRequest();
  const leaveGymMutation = useLeaveGym();

  const activeGym = memberships.find((m) => m.status === 'ACTIVE');
  const pendingGym = memberships.find((m) => m.status === 'PENDING');

  // If a join code is in the URL, auto-fill it
  useEffect(() => {
    const codeFromUrl = searchParams.get('code') || searchParams.get('joinCode');
    if (codeFromUrl) {
      setJoinCodeInput(codeFromUrl.toUpperCase());
    }
  }, [searchParams]);

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    try {
      const res = await joinByCodeMutation.mutateAsync(cleanCode);
      toast.success(t('gym.joinedInstantly', { gymName: res.gym.name }));
      setJoinCodeInput('');
      // Clean query parameter if present
      if (searchParams.has('code') || searchParams.has('joinCode')) {
        const next = new URLSearchParams(searchParams);
        next.delete('code');
        next.delete('joinCode');
        setSearchParams(next);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('common.error')));
    }
  };

  const handleRequestMembership = async (gymId: string) => {
    try {
      await requestMembershipMutation.mutateAsync(gymId);
      toast.success(t('gym.membershipRequested'));
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('common.error')));
    }
  };

  const handleCancelRequest = async (gymId: string) => {
    try {
      await cancelRequestMutation.mutateAsync(gymId);
      toast.success(t('gym.requestCancelled'));
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('common.error')));
    }
  };

  const handleLeaveGym = async (gymId: string) => {
    if (!window.confirm(t('gym.leaveGymConfirm'))) return;
    try {
      await leaveGymMutation.mutateAsync(gymId);
      toast.success(t('gym.gymLeft'));
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('common.error')));
    }
  };

  return (
    <SectionContainer data-testid="client-gyms-section">
      {/* 1. CURRENT MEMBERSHIP STATUS */}
      {activeGym ? (
        <ActiveGymCard data-testid="active-gym-card">
          {activeGym.coverUrl ? (
            <GymCover $img={activeGym.coverUrl} />
          ) : (
            <GymCoverGradient />
          )}
          <ActiveGymContent>
            <GymHeaderRow>
              <GymLogoWrap>
                {activeGym.logoUrl ? (
                  <GymLogoImg src={activeGym.logoUrl} alt={activeGym.name} />
                ) : (
                  <GymLogoPlaceholder>
                    <Building2 size={24} color="#7c84aa" />
                  </GymLogoPlaceholder>
                )}
              </GymLogoWrap>
              <GymMeta>
                <BadgeRow>
                  <ActiveBadge>
                    <Check size={13} />
                    <span>{t('gym.alreadyMember')}</span>
                  </ActiveBadge>
                  {activeGym.city && (
                    <CityPill>
                      <MapPin size={12} />
                      <span>{activeGym.city}</span>
                    </CityPill>
                  )}
                </BadgeRow>
                <GymNameTitle>{activeGym.name}</GymNameTitle>
                {activeGym.address && <GymAddress>{activeGym.address}</GymAddress>}
              </GymMeta>
              <LeaveGymBtn
                type="button"
                onClick={() => handleLeaveGym(activeGym.gymId)}
                data-testid="leave-gym-btn"
                disabled={leaveGymMutation.isPending}
              >
                <DoorOpen size={15} />
                <span>{t('gym.leaveGym')}</span>
              </LeaveGymBtn>
            </GymHeaderRow>

            {activeGym.description && <GymDesc>{activeGym.description}</GymDesc>}

            <GymFooterRow>
              <JoinedDateInfo>
                <Calendar size={13} />
                <span>Joined {new Date(activeGym.joinedAt).toLocaleDateString()}</span>
              </JoinedDateInfo>
              {activeGym.amenities?.length ? (
                <AmenitiesRow>
                  {activeGym.amenities.slice(0, 4).map((amenity) => (
                    <AmenityChip key={amenity}>{amenity}</AmenityChip>
                  ))}
                </AmenitiesRow>
              ) : null}
            </GymFooterRow>
          </ActiveGymContent>
        </ActiveGymCard>
      ) : pendingGym ? (
        <PendingRequestCard data-testid="pending-gym-banner">
          <PendingLeft>
            <PendingShield>
              <Shield size={22} color="#f7c873" />
            </PendingShield>
            <div>
              <PendingTitle>{t('gym.pendingRequestFor')}</PendingTitle>
              <PendingGymName>{pendingGym.name}</PendingGymName>
              <PendingDate>
                <Clock size={12} />
                <span>Requested on {new Date(pendingGym.joinedAt).toLocaleDateString()}</span>
              </PendingDate>
            </div>
          </PendingLeft>
          <CancelRequestBtn
            type="button"
            onClick={() => handleCancelRequest(pendingGym.gymId)}
            data-testid="cancel-gym-request-btn"
            disabled={cancelRequestMutation.isPending}
          >
            <Trash2 size={14} />
            <span>{t('gym.cancelRequest')}</span>
          </CancelRequestBtn>
        </PendingRequestCard>
      ) : (
        <NoGymCard data-testid="no-gym-joined-card">
          <Building2 size={36} color="#7c84aa" />
          <NoGymTitle>{t('gym.noGymJoined')}</NoGymTitle>
          <NoGymDesc>{t('gym.joinGymDesc')}</NoGymDesc>
        </NoGymCard>
      )}

      {/* 2. INSTANT JOIN VIA CODE / QR */}
      <JoinCodeCard data-testid="join-code-card">
        <SectionTitle>
          <QrCode size={18} color="#ffb3b1" />
          {t('gym.joinWithCode')}
        </SectionTitle>
        <JoinCodeForm onSubmit={handleJoinByCode}>
          <CodeInputWrapper>
            <CodeInput
              type="text"
              placeholder={t('gym.enterJoinCode')}
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              data-testid="join-code-input"
              maxLength={20}
            />
          </CodeInputWrapper>
          <JoinCodeSubmitBtn
            type="submit"
            disabled={!joinCodeInput.trim() || joinByCodeMutation.isPending}
            data-testid="join-code-submit-btn"
          >
            <Check size={16} />
            <span>{joinByCodeMutation.isPending ? t('common.loading') : t('gym.joinInstantly')}</span>
          </JoinCodeSubmitBtn>
        </JoinCodeForm>
      </JoinCodeCard>

      {/* 3. EXPLORE GYMS DIRECTORY */}
      <DirectoryCard data-testid="explore-gyms-card">
        <DirectoryHeader>
          <SectionTitle>
            <Building2 size={18} color="#ffb3b1" />
            {t('gym.exploreGyms')}
          </SectionTitle>
          <SearchWrapper>
            <Search size={15} />
            <SearchInput
              type="text"
              placeholder={t('gym.searchGyms')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="search-gyms-input"
            />
          </SearchWrapper>
        </DirectoryHeader>

        {gymsLoading && <LoadingText>{t('common.loading')}</LoadingText>}

        {!gymsLoading && publicGyms.length === 0 && (
          <EmptyDirectory data-testid="empty-gyms">
            <Building2 size={36} color="#7c84aa" />
            <p>{t('gym.noGymsFound')}</p>
          </EmptyDirectory>
        )}

        <GymsGrid>
          {publicGyms.map((gym) => {
            const isCurrentGym = activeGym?.gymId === gym.id;
            const isPendingThisGym = pendingGym?.gymId === gym.id;
            const hasOtherGym = Boolean(activeGym) && !isCurrentGym;

            return (
              <GymCard key={gym.id} data-testid={`gym-card-${gym.id}`}>
                {gym.coverUrl ? <CardCover $img={gym.coverUrl} /> : <CardCoverGradient />}
                <CardBody>
                  <CardTop>
                    <GymThumbWrap>
                      {gym.logoUrl ? (
                        <GymThumbImg src={gym.logoUrl} alt={gym.name} />
                      ) : (
                        <GymThumbPlaceholder>
                          <Building2 size={20} color="#7c84aa" />
                        </GymThumbPlaceholder>
                      )}
                    </GymThumbWrap>
                    <GymCardInfo>
                      <GymCardName>{gym.name}</GymCardName>
                      {gym.city && (
                        <CityLocation>
                          <MapPin size={12} />
                          <span>{gym.city}</span>
                        </CityLocation>
                      )}
                    </GymCardInfo>
                  </CardTop>

                  {gym.description && <GymCardBio>{gym.description}</GymCardBio>}

                  <GymMetricsRow>
                    <MetricPill>
                      <Users size={12} />
                      <span>{gym.memberCount ?? 0} members</span>
                    </MetricPill>
                    {gym.amenities?.length ? (
                      <AmenitiesTags>
                        {gym.amenities.slice(0, 2).map((a) => (
                          <MiniAmenity key={a}>{a}</MiniAmenity>
                        ))}
                      </AmenitiesTags>
                    ) : null}
                  </GymMetricsRow>

                  <CardActions>
                    {isCurrentGym ? (
                      <StatusPill $variant="success" data-testid={`current-gym-badge-${gym.id}`}>
                        <Check size={13} />
                        <span>{t('gym.alreadyMember')}</span>
                      </StatusPill>
                    ) : isPendingThisGym ? (
                      <StatusPill $variant="warning" data-testid={`pending-gym-badge-${gym.id}`}>
                        <Clock size={13} />
                        <span>{t('gym.requestPending')}</span>
                      </StatusPill>
                    ) : hasOtherGym ? (
                      <ActionBtnDisabled title={t('gym.otherGymActive')} disabled>
                        <span>{t('gym.requestMembership')}</span>
                      </ActionBtnDisabled>
                    ) : (
                      <RequestGymBtn
                        type="button"
                        onClick={() => handleRequestMembership(gym.id)}
                        disabled={requestMembershipMutation.isPending}
                        data-testid={`request-gym-${gym.id}`}
                      >
                        <Send size={14} />
                        <span>{t('gym.requestMembership')}</span>
                      </RequestGymBtn>
                    )}
                  </CardActions>
                </CardBody>
              </GymCard>
            );
          })}
        </GymsGrid>
      </DirectoryCard>
    </SectionContainer>
  );
}

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ActiveGymCard = styled(CardSurface)`
  padding: 0;
  overflow: hidden;
  border: 1px solid rgba(16, 185, 129, 0.3);
  background: linear-gradient(180deg, #171b34 0%, #121630 100%);
`;

const GymCover = styled.div<{ $img: string }>`
  height: 7.5rem;
  background: url(${({ $img }) => $img}) center/cover no-repeat;
`;

const GymCoverGradient = styled.div`
  height: 5.5rem;
  background: linear-gradient(135deg, #1a224a 0%, #111428 100%);
`;

const ActiveGymContent = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GymHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const GymLogoWrap = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 0.85rem;
  overflow: hidden;
  border: 2px solid #20264b;
  flex-shrink: 0;
  background: #141830;
  margin-top: -2.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`;

const GymLogoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GymLogoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #181d3d;
`;

const GymMeta = styled.div`
  flex: 1;
  min-width: 14rem;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const ActiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 1rem;
`;

const CityPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #7c84aa;
  font-size: 0.75rem;
`;

const GymNameTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #f7f7ff;
`;

const GymAddress = styled.p`
  margin: 0.15rem 0 0;
  font-size: 0.8rem;
  color: #7c84aa;
`;

const LeaveGymBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.25);
  color: #ff8a93;
  padding: 0.45rem 0.85rem;
  border-radius: 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #ef233c;
    color: #fff;
  }
`;

const GymDesc = styled.p`
  margin: 0;
  font-size: 0.84rem;
  color: #949ab8;
  line-height: 1.45;
`;

const GymFooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(126, 136, 175, 0.12);
  padding-top: 0.75rem;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const JoinedDateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: #7c84aa;
`;

const AmenitiesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const AmenityChip = styled.span`
  background: rgba(126, 136, 175, 0.12);
  color: #cbd5e1;
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  border-radius: 0.4rem;
`;

const PendingRequestCard = styled(CardSurface)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(180deg, #1f1b2c 0%, #151428 100%);
  border: 1px solid rgba(247, 200, 115, 0.3);
  gap: 1rem;
  flex-wrap: wrap;
`;

const PendingLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PendingShield = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  background: rgba(247, 200, 115, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const PendingTitle = styled.span`
  font-size: 0.75rem;
  color: #f7c873;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PendingGymName = styled.h3`
  margin: 0.1rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f7f7ff;
`;

const PendingDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #7c84aa;
`;

const CancelRequestBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.25);
  color: #ff8a93;
  padding: 0.45rem 0.85rem;
  border-radius: 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #ef233c;
    color: #fff;
  }
`;

const NoGymCard = styled(CardSurface)`
  padding: 2.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
  background: linear-gradient(180deg, #171b34 0%, #121630 100%);
  border: 1px dashed rgba(126, 136, 175, 0.25);
`;

const NoGymTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #f7f7ff;
  font-weight: 700;
`;

const NoGymDesc = styled.p`
  margin: 0;
  max-width: 26rem;
  font-size: 0.84rem;
  color: #7c84aa;
  line-height: 1.4;
`;

const JoinCodeCard = styled(CardSurface)`
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const JoinCodeForm = styled.form`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const CodeInputWrapper = styled.div`
  flex: 1;
  min-width: 14rem;
`;

const CodeInput = styled.input`
  width: 100%;
  background: #0f1326;
  border: 1px solid rgba(126, 136, 175, 0.25);
  color: #f7f7ff;
  padding: 0.65rem 0.95rem;
  border-radius: 0.65rem;
  font-size: 0.9rem;
  font-family: monospace;
  font-weight: 700;
  letter-spacing: 0.05em;

  &:focus {
    outline: none;
    border-color: #ef233c;
  }
`;

const JoinCodeSubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #ef233c;
  border: none;
  color: #fff;
  padding: 0.65rem 1.25rem;
  border-radius: 0.65rem;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #d90429;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DirectoryCard = styled(CardSurface)`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const DirectoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #0f1326;
  border: 1px solid rgba(126, 136, 175, 0.2);
  border-radius: 0.6rem;
  padding: 0.45rem 0.85rem;
  color: #7c84aa;
  width: 100%;
  max-width: 18rem;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: #f7f7ff;
  font-size: 0.82rem;
  width: 100%;

  &:focus {
    outline: none;
  }
`;

const LoadingText = styled.p`
  color: #7c84aa;
  font-size: 0.85rem;
`;

const EmptyDirectory = styled.div`
  text-align: center;
  padding: 2.5rem 1rem;
  color: #7c84aa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  p {
    margin: 0;
    font-size: 0.85rem;
  }
`;

const GymsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1.25rem;
`;

const GymCard = styled.article`
  background: linear-gradient(180deg, #171b34 0%, #121630 100%);
  border: 1px solid rgba(126, 136, 175, 0.16);
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardCover = styled.div<{ $img: string }>`
  height: 5.5rem;
  background: url(${({ $img }) => $img}) center/cover no-repeat;
`;

const CardCoverGradient = styled.div`
  height: 4.5rem;
  background: linear-gradient(135deg, #1d244f 0%, #121630 100%);
`;

const CardBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  justify-content: space-between;
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const GymThumbWrap = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.65rem;
  overflow: hidden;
  border: 1px solid #2d3663;
  flex-shrink: 0;
  background: #141830;
  margin-top: -1.75rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
`;

const GymThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GymThumbPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #191e42;
`;

const GymCardInfo = styled.div`
  flex: 1;
  overflow: hidden;
`;

const GymCardName = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #f7f7ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CityLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #7c84aa;
  margin-top: 0.1rem;
`;

const GymCardBio = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #949ab8;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const GymMetricsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.74rem;
  color: #7c84aa;
  flex-wrap: wrap;
`;

const MetricPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

const AmenitiesTags = styled.div`
  display: flex;
  gap: 0.3rem;
`;

const MiniAmenity = styled.span`
  background: rgba(126, 136, 175, 0.12);
  color: #cbd5e1;
  font-size: 0.68rem;
  padding: 0.1rem 0.4rem;
  border-radius: 0.3rem;
`;

const CardActions = styled.div`
  border-top: 1px solid rgba(126, 136, 175, 0.1);
  padding-top: 0.65rem;
`;

const StatusPill = styled.div<{ $variant: 'success' | 'warning' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.4rem;
  border-radius: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  background: ${({ $variant }) =>
    $variant === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(247, 200, 115, 0.15)'};
  border: 1px solid
    ${({ $variant }) => ($variant === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(247, 200, 115, 0.3)')};
  color: ${({ $variant }) => ($variant === 'success' ? '#34d399' : '#f7c873')};
`;

const ActionBtnDisabled = styled.button`
  width: 100%;
  padding: 0.4rem;
  border-radius: 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  background: rgba(126, 136, 175, 0.1);
  border: 1px solid rgba(126, 136, 175, 0.2);
  color: #7c84aa;
  cursor: not-allowed;
`;

const RequestGymBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.4rem;
  border-radius: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.25);
  color: #ff8a93;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #ef233c;
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

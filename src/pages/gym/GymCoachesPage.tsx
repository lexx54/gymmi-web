import { Check, Dumbbell, Shield, Trash2, UserCheck, Users, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import styled from 'styled-components';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';
import { useAuth } from '../../context/AuthContext';
import {
  useMyGymCoaches,
  useApproveGymCoach,
  useRejectGymCoach,
  useUpdateCoachPermissions,
  useRemoveGymCoach,
} from '../../hooks/useGyms';
import type { GymCoach } from '../../types/gym';

export default function GymCoachesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: coaches = [], isLoading, isError } = useMyGymCoaches();
  const approveMutation = useApproveGymCoach();
  const rejectMutation = useRejectGymCoach();
  const updatePermissionsMutation = useUpdateCoachPermissions();
  const removeCoachMutation = useRemoveGymCoach();

  const pendingCoaches = coaches.filter((c) => c.status === 'PENDING');
  const approvedCoaches = coaches.filter((c) => c.status === 'APPROVED');

  const handleApprove = async (coach: GymCoach) => {
    try {
      await approveMutation.mutateAsync(coach.id);
      toast.success(t('gym.coachApproved'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleReject = async (coach: GymCoach) => {
    try {
      await rejectMutation.mutateAsync(coach.id);
      toast.success(t('gym.coachRejected'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleTogglePublish = async (coach: GymCoach) => {
    try {
      await updatePermissionsMutation.mutateAsync({
        coachId: coach.id,
        canPublishRoutines: !coach.canPublishRoutines,
      });
      toast.success(t('gym.permissionsUpdated'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleRemove = async (coach: GymCoach) => {
    const coachName = coach.trainer?.username ?? 'Coach';
    if (!window.confirm(`Are you sure you want to remove ${coachName}?`)) return;
    try {
      await removeCoachMutation.mutateAsync(coach.id);
      toast.success(t('gym.coachRemoved'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <PageShell>
      <Sidebar username={user?.username ?? 'Alex'} />
      <Main>
        <HeaderRow>
          <div>
            <Title>{t('gym.coachesTitle')}</Title>
            <Subtitle>{t('gym.coachesDesc')}</Subtitle>
          </div>
          <TopBar />
        </HeaderRow>

        <StatsRow>
          <StatPill>
            <UserCheck size={16} color="#ef233c" />
            <span>
              <strong>{approvedCoaches.length}</strong> {t('gym.approvedCoaches')}
            </span>
          </StatPill>
          {pendingCoaches.length > 0 && (
            <PendingPill data-testid="pending-coaches-pill">
              <Shield size={16} color="#f7c873" />
              <span>
                <strong>{pendingCoaches.length}</strong> {t('gym.pendingApprovals')}
              </span>
            </PendingPill>
          )}
        </StatsRow>

        {isLoading && <LoadingText>{t('common.loading')}</LoadingText>}
        {isError && <ErrorText>{t('common.error')}</ErrorText>}

        {/* PENDING APPROVALS */}
        {pendingCoaches.length > 0 && (
          <Section data-testid="pending-coaches-section">
            <SectionHeader>
              <Shield size={18} color="#f7c873" />
              <SectionTitle>{t('gym.pendingApprovals')}</SectionTitle>
              <CountBadge>{pendingCoaches.length}</CountBadge>
            </SectionHeader>

            <Grid>
              {pendingCoaches.map((coach) => (
                <CoachCard key={coach.id} data-testid={`pending-coach-${coach.id}`}>
                  <CardHeader>
                    <Avatar $img={coach.trainer?.avatarUrl || coach.trainer?.trainerProfile?.logoUrl} />
                    <div>
                      <CoachName>{coach.trainer?.username}</CoachName>
                      <CoachEmail>{coach.trainer?.email}</CoachEmail>
                    </div>
                  </CardHeader>

                  {coach.trainer?.trainerProfile?.description && (
                    <Bio>{coach.trainer.trainerProfile.description}</Bio>
                  )}

                  {coach.trainer?.trainerProfile?.specializations?.length ? (
                    <ChipsRow>
                      {coach.trainer.trainerProfile.specializations.map((spec) => (
                        <SpecBadge key={spec}>{spec}</SpecBadge>
                      ))}
                    </ChipsRow>
                  ) : null}

                  <ActionsRow>
                    <ApproveBtn
                      type="button"
                      onClick={() => handleApprove(coach)}
                      data-testid={`approve-coach-${coach.id}`}
                    >
                      <Check size={15} />
                      <span>{t('gym.approve')}</span>
                    </ApproveBtn>
                    <RejectBtn
                      type="button"
                      onClick={() => handleReject(coach)}
                      data-testid={`reject-coach-${coach.id}`}
                    >
                      <X size={15} />
                      <span>{t('gym.reject')}</span>
                    </RejectBtn>
                  </ActionsRow>
                </CoachCard>
              ))}
            </Grid>
          </Section>
        )}

        {/* APPROVED COACHES */}
        <Section data-testid="approved-coaches-section">
          <SectionHeader>
            <UserCheck size={18} color="#ef233c" />
            <SectionTitle>{t('gym.approvedCoaches')}</SectionTitle>
            <CountBadge>{approvedCoaches.length}</CountBadge>
          </SectionHeader>

          {approvedCoaches.length === 0 ? (
            <EmptyState data-testid="empty-coaches">
              <Users size={36} color="#7c84aa" />
              <h3>{t('gym.noCoaches')}</h3>
              <p>{t('gym.coachesDesc')}</p>
            </EmptyState>
          ) : (
            <Grid>
              {approvedCoaches.map((coach) => (
                <CoachCard key={coach.id} data-testid={`approved-coach-${coach.id}`}>
                  <CardHeader>
                    <Avatar $img={coach.trainer?.avatarUrl || coach.trainer?.trainerProfile?.logoUrl} />
                    <div>
                      <CoachName>{coach.trainer?.username}</CoachName>
                      <CoachEmail>{coach.trainer?.email}</CoachEmail>
                    </div>
                  </CardHeader>

                  {coach.trainer?.trainerProfile?.monthlyPrice !== undefined && (
                    <RateRow>
                      <span>Rate:</span>
                      <strong>${coach.trainer.trainerProfile.monthlyPrice} / mo</strong>
                    </RateRow>
                  )}

                  {coach.trainer?.trainerProfile?.specializations?.length ? (
                    <ChipsRow>
                      {coach.trainer.trainerProfile.specializations.map((spec) => (
                        <SpecBadge key={spec}>{spec}</SpecBadge>
                      ))}
                    </ChipsRow>
                  ) : null}

                  <PermissionsRow>
                    <PermLabel>
                      <Dumbbell size={14} />
                      <span>{t('gym.canPublishRoutines')}</span>
                    </PermLabel>
                    <ToggleBtn
                      type="button"
                      $active={coach.canPublishRoutines}
                      onClick={() => handleTogglePublish(coach)}
                      data-testid={`toggle-publish-${coach.id}`}
                      aria-pressed={coach.canPublishRoutines}
                    >
                      <ToggleThumb $active={coach.canPublishRoutines} />
                    </ToggleBtn>
                  </PermissionsRow>

                  <CardFooter>
                    <RemoveBtn
                      type="button"
                      onClick={() => handleRemove(coach)}
                      data-testid={`remove-coach-${coach.id}`}
                    >
                      <Trash2 size={14} />
                      <span>{t('gym.removeCoach')}</span>
                    </RemoveBtn>
                  </CardFooter>
                </CoachCard>
              ))}
            </Grid>
          )}
        </Section>
      </Main>
    </PageShell>
  );
}

const PageShell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0b1020;
  color: #f7f7ff;
`;

const Main = styled.main`
  flex: 1;
  padding: 1.4rem 2rem 2.5rem;
  overflow-y: auto;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #f5f6ff;
`;

const Subtitle = styled.p`
  margin: 0.25rem 0 0;
  color: #949ab8;
  font-size: 0.88rem;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const StatPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.16);
  border-radius: 2rem;
  padding: 0.45rem 0.95rem;
  font-size: 0.84rem;
  color: #c5c9e2;
`;

const PendingPill = styled(StatPill)`
  background: rgba(247, 200, 115, 0.1);
  border-color: rgba(247, 200, 115, 0.3);
  color: #f7c873;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f5f6ff;
`;

const CountBadge = styled.span`
  background: rgba(126, 136, 175, 0.15);
  border: 1px solid rgba(126, 136, 175, 0.25);
  color: #c5c9e2;
  padding: 0.15rem 0.55rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.25rem;
`;

const CoachCard = styled.article`
  background: linear-gradient(180deg, #171b34 0%, #121630 100%);
  border: 1px solid rgba(126, 136, 175, 0.16);
  border-radius: 1.25rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.9rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div<{ $img?: string | null }>`
  width: 2.85rem;
  height: 2.85rem;
  border-radius: 0.75rem;
  background: ${({ $img }) =>
    $img
      ? `url(${$img}) center/cover no-repeat`
      : 'linear-gradient(180deg, #2c3357 0%, #1b203d 100%)'};
  border: 1px solid #303a63;
  flex-shrink: 0;
`;

const CoachName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #f7f7ff;
`;

const CoachEmail = styled.p`
  margin: 0.15rem 0 0;
  font-size: 0.78rem;
  color: #7c84aa;
`;

const Bio = styled.p`
  margin: 0;
  color: #949ab8;
  font-size: 0.82rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const RateRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  color: #7c84aa;

  strong {
    color: #f7c873;
  }
`;

const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const SpecBadge = styled.span`
  background: rgba(126, 136, 175, 0.1);
  border: 1px solid rgba(126, 136, 175, 0.18);
  color: #c5c9e2;
  font-size: 0.72rem;
  padding: 0.18rem 0.5rem;
  border-radius: 0.4rem;
`;

const ActionsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
  margin-top: 0.5rem;
`;

const ApproveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  background: rgba(46, 213, 115, 0.15);
  border: 1px solid rgba(46, 213, 115, 0.35);
  color: #2ed573;
  border-radius: 0.65rem;
  padding: 0.55rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(46, 213, 115, 0.25);
  }
`;

const RejectBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  background: rgba(239, 35, 60, 0.15);
  border: 1px solid rgba(239, 35, 60, 0.35);
  color: #ff8a93;
  border-radius: 0.65rem;
  padding: 0.55rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(239, 35, 60, 0.25);
  }
`;

const PermissionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 19, 41, 0.5);
  border-radius: 0.65rem;
  padding: 0.5rem 0.65rem;
  border: 1px solid rgba(126, 136, 175, 0.1);
`;

const PermLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  color: #c5c9e2;
`;

const ToggleBtn = styled.button<{ $active?: boolean }>`
  width: 2.4rem;
  height: 1.35rem;
  border-radius: 1rem;
  background: ${({ $active }) => ($active ? '#ef233c' : '#262d47')};
  border: none;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease;
  padding: 2px;
`;

const ToggleThumb = styled.div<{ $active?: boolean }>`
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: #ffffff;
  transition: transform 0.2s ease;
  transform: ${({ $active }) => ($active ? 'translateX(1.05rem)' : 'translateX(0)')};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(126, 136, 175, 0.1);
  padding-top: 0.65rem;
`;

const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: transparent;
  border: none;
  color: #7c84aa;
  font-size: 0.78rem;
  cursor: pointer;
  padding: 0.25rem 0.45rem;
  border-radius: 0.4rem;
  transition: all 0.15s ease;

  &:hover {
    color: #ef233c;
    background: rgba(239, 35, 60, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background: #141830;
  border: 1px dashed rgba(126, 136, 175, 0.2);
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #f7f7ff;
  }

  p {
    margin: 0;
    max-width: 22rem;
    font-size: 0.84rem;
    color: #949ab8;
  }
`;

const LoadingText = styled.p`
  color: #7c84aa;
  font-size: 0.9rem;
`;

const ErrorText = styled.p`
  color: #ef233c;
  font-size: 0.9rem;
`;

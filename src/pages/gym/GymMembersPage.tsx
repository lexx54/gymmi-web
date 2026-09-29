import { Calendar, Search, Trash2, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import styled from 'styled-components';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';
import { useAuth } from '../../context/AuthContext';
import { useMyGym, useMyGymMembers, useRemoveGymMember } from '../../hooks/useGyms';
import type { GymMember } from '../../types/gym';

export default function GymMembersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: members = [], isLoading, isError } = useMyGymMembers();
  const { data: gymData } = useMyGym();
  const removeMemberMutation = useRemoveGymMember();
  const [search, setSearch] = useState('');

  const activeMembers = members.filter((m) => m.status === 'ACTIVE');
  const capacity = gymData?.capacity ?? 100;
  const capacityPercent = Math.min(100, Math.round((activeMembers.length / Math.max(1, capacity)) * 100));

  const filteredMembers = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return activeMembers;
    return activeMembers.filter((m) => {
      const username = m.client?.username?.toLowerCase() ?? '';
      const email = m.client?.email?.toLowerCase() ?? '';
      return username.includes(needle) || email.includes(needle);
    });
  }, [activeMembers, search]);

  const handleRemove = async (member: GymMember) => {
    const memberName = member.client?.username ?? 'Member';
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this gym?`)) return;
    try {
      await removeMemberMutation.mutateAsync(member.id);
      toast.success(t('gym.memberRemoved'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <PageShell>
      <Sidebar username={user?.username ?? 'Alex'} />
      <Main>
        <TopBar title={t('gym.membersTitle')} />

        {/* Capacity Progress Bar Card */}
        <CapacityCard data-testid="gym-capacity-card">
          <CapacityHeader>
            <CapacityLabelGroup>
              <Users size={16} color="#ef233c" />
              <span>{t('gym.capacity')}</span>
            </CapacityLabelGroup>
            <CapacityCount>
              <strong>{activeMembers.length}</strong> / {capacity} {t('gym.members')} ({capacityPercent}%)
            </CapacityCount>
          </CapacityHeader>
          <ProgressBarTrack>
            <ProgressBarFill $percent={capacityPercent} />
          </ProgressBarTrack>
        </CapacityCard>

        <SearchWrapper>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder={t('gym.searchMembers')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="search-gym-members"
          />
        </SearchWrapper>

        {isLoading && <LoadingText>{t('common.loading')}</LoadingText>}
        {isError && <ErrorText>{t('common.error')}</ErrorText>}

        {!isLoading && filteredMembers.length === 0 && (
          <EmptyState data-testid="empty-members">
            <Users size={36} color="#7c84aa" />
            <h3>{t('gym.noMembers')}</h3>
            <p>{t('gym.membersDesc')}</p>
          </EmptyState>
        )}

        <Grid>
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} data-testid={`member-card-${member.id}`}>
              <MemberHeader>
                <Avatar $img={member.client?.avatarUrl} />
                <MemberInfo>
                  <MemberName>{member.client?.username}</MemberName>
                  <MemberEmail>{member.client?.email}</MemberEmail>
                </MemberInfo>
              </MemberHeader>

              {member.client?.userProfile?.goal && (
                <GoalBadge>{member.client.userProfile.goal}</GoalBadge>
              )}

              <CardBottom>
                <JoinedDate>
                  <Calendar size={13} />
                  <span>
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </span>
                </JoinedDate>
                <RemoveBtn
                  type="button"
                  onClick={() => handleRemove(member)}
                  title={t('gym.removeMember')}
                  data-testid={`remove-member-${member.id}`}
                >
                  <Trash2 size={14} />
                  <span>{t('gym.removeMember')}</span>
                </RemoveBtn>
              </CardBottom>
            </MemberCard>
          ))}
        </Grid>
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



const CapacityCard = styled.div`
  background: linear-gradient(180deg, #171b34 0%, #121630 100%);
  border: 1px solid rgba(126, 136, 175, 0.16);
  border-radius: 1.15rem;
  padding: 1.15rem 1.35rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CapacityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CapacityLabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #f5f6ff;
`;

const CapacityCount = styled.div`
  font-size: 0.86rem;
  color: #c5c9e2;

  strong {
    color: #ef233c;
  }
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 0.5rem;
  background: #202646;
  border-radius: 1rem;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => `${$percent}%`};
  background: linear-gradient(90deg, #ef233c 0%, #ff8a93 100%);
  border-radius: 1rem;
  transition: width 0.3s ease;
`;

const SearchWrapper = styled.div`
  position: relative;
  max-width: 28rem;
  margin-bottom: 1.5rem;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.95rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7c84aa;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.18);
  border-radius: 0.85rem;
  padding: 0.65rem 1rem 0.65rem 2.45rem;
  color: #f7f7ff;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #ef233c;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1.25rem;
`;

const MemberCard = styled.article`
  background: linear-gradient(180deg, #171b34 0%, #121630 100%);
  border: 1px solid rgba(126, 136, 175, 0.14);
  border-radius: 1.25rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.85rem;
`;

const MemberHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div<{ $img?: string | null }>`
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 0.7rem;
  background: ${({ $img }) =>
    $img
      ? `url(${$img}) center/cover no-repeat`
      : 'linear-gradient(180deg, #2c3357 0%, #1b203d 100%)'};
  border: 1px solid #303a63;
  flex-shrink: 0;
`;

const MemberInfo = styled.div`
  min-width: 0;
`;

const MemberName = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #f7f7ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MemberEmail = styled.p`
  margin: 0.15rem 0 0;
  font-size: 0.76rem;
  color: #7c84aa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GoalBadge = styled.span`
  align-self: flex-start;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.25);
  color: #ff8a93;
  padding: 0.2rem 0.6rem;
  border-radius: 0.45rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(126, 136, 175, 0.1);
  padding-top: 0.65rem;
`;

const JoinedDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  color: #7c84aa;
`;

const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: transparent;
  border: none;
  color: #7c84aa;
  font-size: 0.76rem;
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

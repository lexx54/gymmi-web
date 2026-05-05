import { Heart, Pencil, TrendingUp } from 'lucide-react';
import styled from 'styled-components';
import { CardSurface } from './SettingsShell';

/**
 * Profile hero section displaying user identity, bio, tags,
 * workout frequency, and goal progress.
 */
export function ProfileHeroCard() {
  return (
    <HeroWrapper>
      <HeroLeft>
        <AvatarSection>
          <AvatarBox>
            <AvatarPlaceholder />
            <EditBadge aria-label="Edit avatar">
              <Pencil size={12} />
            </EditBadge>
          </AvatarBox>
        </AvatarSection>
        <ProfileInfo>
          <DisplayName>Alex &quot;Volt&quot; Sterling</DisplayName>
          <StatusLine>ELITE STATUS &bull; MEMBER SINCE OCT 2022</StatusLine>
          <Bio>
            Performance-driven endurance athlete focused on high-intensity
            metabolic conditioning. Currently training for the Kinetic Global
            Sprint series.
          </Bio>
          <TagRow>
            <Tag>
              <TagIcon>&#9878;</TagIcon> Endurance Pro
            </Tag>
            <Tag>
              <TagIcon>&#9201;</TagIcon> PB: 2:45 Marathon
            </Tag>
          </TagRow>
          <HeartStat>
            <Heart size={14} fill="#ffb3b1" color="#ffb3b1" />
            <span>48 BPM RHR</span>
          </HeartStat>
        </ProfileInfo>
      </HeroLeft>
      <HeroRight>
        <StatBlock>
          <StatHeader>
            <StatLabel>WORKOUT FREQUENCY</StatLabel>
            <TrendingUp size={16} color="#ffb3b1" />
          </StatHeader>
          <StatValue>
            6.4<StatUnit>/week</StatUnit>
          </StatValue>
        </StatBlock>
        <ProgressBlock>
          <ProgressHeader>
            <StatLabel>GOAL PROGRESS</StatLabel>
            <ProgressPercent>84%</ProgressPercent>
          </ProgressHeader>
          <ProgressTrack>
            <ProgressFill style={{ width: '84%' }} />
          </ProgressTrack>
        </ProgressBlock>
        <ViewProfileButton type="button">VIEW PUBLIC PROFILE</ViewProfileButton>
      </HeroRight>
    </HeroWrapper>
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
`;

const AvatarSection = styled.div`
  flex-shrink: 0;
`;

const AvatarBox = styled.div`
  position: relative;
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 1rem;
  border: 2px solid #ef233c;
  overflow: visible;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.85rem;
  background: linear-gradient(180deg, #2c3357 0%, #1b203d 100%);
`;

const EditBadge = styled.button`
  position: absolute;
  bottom: -0.4rem;
  right: -0.4rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(135deg, #ffb3b1, #ff535a);
  color: #1a0a0c;
  display: grid;
  place-items: center;
  cursor: pointer;
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

const TagIcon = styled.span`
  font-size: 0.85rem;
`;

const HeartStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #ffb3b1;
  font-size: 0.8rem;
  font-weight: 600;
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

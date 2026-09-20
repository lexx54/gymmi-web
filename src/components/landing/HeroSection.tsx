import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  Activity,
  Award,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Interactive demo card state
  const [completedSets, setCompletedSets] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
  });
  const [seconds, setSeconds] = useState(1725); // 28:45

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleSet = (index: number) => {
    setCompletedSets((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const completedCount = Object.values(completedSets).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 3) * 100);

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HeroWrapper>
      <GlowCircleLeft />
      <GlowCircleRight />

      <HeroContent>
        {/* Left Column: Messaging & CTA */}
        <HeroTextSection>
          <Badge>
            <Sparkles size={14} color="#ef233c" />
            <span>{t('landing.hero.tag')}</span>
          </Badge>

          <MainHeading>
            {t('landing.hero.titleLine1')}
            <GradientHighlight>{t('landing.hero.titleHighlight')}</GradientHighlight>
          </MainHeading>

          <Subtitle>{t('landing.hero.subtitle')}</Subtitle>

          <CTAButtonGroup>
            {isAuthenticated ? (
              <PrimaryCTAButton type="button" onClick={() => navigate('/dashboard')}>
                <LayoutDashboard size={18} />
                <span>{t('landing.nav.dashboard')}</span>
                <ArrowRight size={18} />
              </PrimaryCTAButton>
            ) : (
              <PrimaryCTALink to="/signup">
                <span>{t('landing.hero.ctaPrimary')}</span>
                <ArrowRight size={18} />
              </PrimaryCTALink>
            )}

            <SecondaryCTAButton type="button" onClick={scrollToFeatures}>
              <span>{t('landing.hero.ctaSecondary')}</span>
            </SecondaryCTAButton>
          </CTAButtonGroup>

          {/* Quick Metrics */}
          <MetricsStrip>
            <MetricItem>
              <MetricIconWrapper $color="#ef233c">
                <Flame size={18} />
              </MetricIconWrapper>
              <MetricDetails>
                <MetricValue>100+</MetricValue>
                <MetricLabel>{t('landing.hero.statExercises')}</MetricLabel>
              </MetricDetails>
            </MetricItem>

            <MetricDivider />

            <MetricItem>
              <MetricIconWrapper $color="#38bdf8">
                <Activity size={18} />
              </MetricIconWrapper>
              <MetricDetails>
                <MetricValue>Live</MetricValue>
                <MetricLabel>{t('landing.hero.statLogging')}</MetricLabel>
              </MetricDetails>
            </MetricItem>
          </MetricsStrip>
        </HeroTextSection>

        {/* Right Column: Interactive Workout Card */}
        <HeroPreviewSection>
          <InteractiveCardContainer>
            <CardHeader>
              <CardBadge>
                <LiveDot />
                <span>{t('landing.preview.badge')}</span>
              </CardBadge>
              <TimerBadge>
                <Clock size={14} />
                <span>{formatTimer(seconds)}</span>
              </TimerBadge>
            </CardHeader>

            <RoutineInfo>
              <RoutineTitle>{t('landing.preview.routineName')}</RoutineTitle>
              <RoutineMeta>{t('landing.preview.meta')}</RoutineMeta>
            </RoutineInfo>

            <ProgressWrapper>
              <ProgressHeader>
                <span>{t('landing.preview.completed', { count: completedCount })}</span>
                <span>{progressPercent}%</span>
              </ProgressHeader>
              <ProgressBarTrack>
                <ProgressBarFill $width={progressPercent} />
              </ProgressBarTrack>
            </ProgressWrapper>

            <ExerciseList>
              {/* Exercise 1 */}
              <ExerciseRow
                $completed={!!completedSets[1]}
                onClick={() => toggleSet(1)}
                role="button"
                tabIndex={0}
              >
                <CheckIconWrapper $completed={!!completedSets[1]}>
                  <CheckCircle2 size={18} />
                </CheckIconWrapper>
                <ExerciseDetails>
                  <ExerciseName $completed={!!completedSets[1]}>
                    {t('landing.preview.ex1Name')}
                  </ExerciseName>
                  <ExerciseSpecs>{t('landing.preview.ex1Detail')}</ExerciseSpecs>
                </ExerciseDetails>
                <StatusTag $completed={!!completedSets[1]}>
                  {completedSets[1] ? 'DONE' : 'NEXT'}
                </StatusTag>
              </ExerciseRow>

              {/* Exercise 2 */}
              <ExerciseRow
                $completed={!!completedSets[2]}
                onClick={() => toggleSet(2)}
                role="button"
                tabIndex={0}
              >
                <CheckIconWrapper $completed={!!completedSets[2]}>
                  <CheckCircle2 size={18} />
                </CheckIconWrapper>
                <ExerciseDetails>
                  <ExerciseName $completed={!!completedSets[2]}>
                    {t('landing.preview.ex2Name')}
                  </ExerciseName>
                  <ExerciseSpecs>{t('landing.preview.ex2Detail')}</ExerciseSpecs>
                </ExerciseDetails>
                <StatusTag $completed={!!completedSets[2]}>
                  {completedSets[2] ? 'DONE' : 'NEXT'}
                </StatusTag>
              </ExerciseRow>

              {/* Exercise 3 */}
              <ExerciseRow
                $completed={!!completedSets[3]}
                onClick={() => toggleSet(3)}
                role="button"
                tabIndex={0}
              >
                <CheckIconWrapper $completed={!!completedSets[3]}>
                  <CheckCircle2 size={18} />
                </CheckIconWrapper>
                <ExerciseDetails>
                  <ExerciseName $completed={!!completedSets[3]}>
                    {t('landing.preview.ex3Name')}
                  </ExerciseName>
                  <ExerciseSpecs>{t('landing.preview.ex3Detail')}</ExerciseSpecs>
                </ExerciseDetails>
                <StatusTag $completed={!!completedSets[3]}>
                  {completedSets[3] ? 'DONE' : 'IN PROGRESS'}
                </StatusTag>
              </ExerciseRow>
            </ExerciseList>

            <CardFooter>
              <Award size={16} color="#ef233c" />
              <span>Tap any exercise to simulate real-time completion</span>
            </CardFooter>
          </InteractiveCardContainer>
        </HeroPreviewSection>
      </HeroContent>
    </HeroWrapper>
  );
};

const HeroWrapper = styled.section`
  position: relative;
  overflow: hidden;
  padding: 4rem 1.5rem 6rem;
  background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(239, 35, 60, 0.15), transparent 70%),
    #0b1120;
  min-height: calc(100vh - 4.5rem);
  display: flex;
  align-items: center;
`;

const GlowCircleLeft = styled.div`
  position: absolute;
  top: 15%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(239, 35, 60, 0.12) 0%, transparent 70%);
  pointer-events: none;
  filter: blur(60px);
`;

const GlowCircleRight = styled.div`
  position: absolute;
  bottom: 10%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%);
  pointer-events: none;
  filter: blur(80px);
`;

const HeroContent = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.5rem;
  align-items: center;
  position: relative;
  z-index: 10;

  @media (min-width: 1024px) {
    grid-template-columns: 1.15fr 0.85fr;
  }
`;

const HeroTextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.3);
  border-radius: 9999px;
  width: fit-content;
  color: #fca5a5;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const MainHeading = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.12;
  letter-spacing: -0.03em;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const GradientHighlight = styled.span`
  background: linear-gradient(135deg, #ef233c 0%, #ff758f 50%, #fca5a5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  line-height: 1.7;
  color: #94a3b8;
  max-width: 580px;
`;

const CTAButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const PrimaryCTALink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  background: linear-gradient(135deg, #ef233c 0%, #d90429 100%);
  color: #ffffff;
  text-decoration: none;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 0.9rem 1.85rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(239, 35, 60, 0.45);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px -5px rgba(239, 35, 60, 0.6);
  }
`;

const PrimaryCTAButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  background: linear-gradient(135deg, #ef233c 0%, #d90429 100%);
  border: none;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 0.9rem 1.85rem;
  border-radius: 0.75rem;
  cursor: pointer;
  box-shadow: 0 10px 25px -5px rgba(239, 35, 60, 0.45);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px -5px rgba(239, 35, 60, 0.6);
  }
`;

const SecondaryCTAButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f1f5f9;
  font-size: 1.05rem;
  font-weight: 600;
  padding: 0.9rem 1.6rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const MetricsStrip = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MetricIconWrapper = styled.div<{ $color: string }>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: ${({ $color }) => `${$color}1a`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetricValue = styled.span`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 800;
`;

const MetricLabel = styled.span`
  color: #64748b;
  font-size: 0.8125rem;
  font-weight: 500;
`;

const MetricDivider = styled.div`
  width: 1px;
  height: 2rem;
  background: rgba(255, 255, 255, 0.1);
  display: none;

  @media (min-width: 640px) {
    display: block;
  }
`;

const HeroPreviewSection = styled.div`
  display: flex;
  justify-content: center;
`;

const InteractiveCardContainer = styled.div`
  width: 100%;
  max-width: 440px;
  background: rgba(30, 41, 59, 0.75);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.5rem;
  padding: 1.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(239, 35, 60, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(239, 35, 60, 0.15);
  border: 1px solid rgba(239, 35, 60, 0.3);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  color: #f87171;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const LiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef233c;
  box-shadow: 0 0 8px #ef233c;
  animation: pulse 1.8s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`;

const TimerBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #94a3b8;
  font-size: 0.8125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const RoutineInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const RoutineTitle = styled.h3`
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 800;
`;

const RoutineMeta = styled.span`
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  color: #94a3b8;
  font-size: 0.8125rem;
  font-weight: 600;
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $width: number }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: linear-gradient(90deg, #ef233c, #f87171);
  border-radius: 9999px;
  transition: width 0.3s ease;
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ExerciseRow = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: 0.875rem;
  background: ${({ $completed }) =>
    $completed ? 'rgba(239, 35, 60, 0.08)' : 'rgba(255, 255, 255, 0.04)'};
  border: 1px solid
    ${({ $completed }) => ($completed ? 'rgba(239, 35, 60, 0.25)' : 'rgba(255, 255, 255, 0.06)')};
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(2px);
  }
`;

const CheckIconWrapper = styled.div<{ $completed: boolean }>`
  color: ${({ $completed }) => ($completed ? '#ef233c' : '#475569')};
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
`;

const ExerciseDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ExerciseName = styled.span<{ $completed: boolean }>`
  color: ${({ $completed }) => ($completed ? '#f1f5f9' : '#cbd5e1')};
  font-size: 0.9375rem;
  font-weight: 700;
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  opacity: ${({ $completed }) => ($completed ? 0.85 : 1)};
`;

const ExerciseSpecs = styled.span`
  color: #64748b;
  font-size: 0.8125rem;
  font-weight: 500;
`;

const StatusTag = styled.span<{ $completed: boolean }>`
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  background: ${({ $completed }) =>
    $completed ? 'rgba(239, 35, 60, 0.15)' : 'rgba(255, 255, 255, 0.06)'};
  color: ${({ $completed }) => ($completed ? '#f87171' : '#94a3b8')};
  letter-spacing: 0.03em;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
`;

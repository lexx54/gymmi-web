import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  ArrowRight,
  Flame,
  Activity,
  Sparkles,
  LayoutDashboard,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ActiveSessionMockup } from './mockups/ActiveSessionMockup';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
                <MetricValue>{t('landing.hero.statLoggingValue')}</MetricValue>
                <MetricLabel>{t('landing.hero.statLogging')}</MetricLabel>
              </MetricDetails>
            </MetricItem>

            <MetricDivider />

            <MetricItem>
              <MetricIconWrapper $color="#fbbf24">
                <Trophy size={18} />
              </MetricIconWrapper>
              <MetricDetails>
                <MetricValue>{t('landing.hero.statTiersValue')}</MetricValue>
                <MetricLabel>{t('landing.hero.statClassifications')}</MetricLabel>
              </MetricDetails>
            </MetricItem>
          </MetricsStrip>
        </HeroTextSection>

        {/* Right Column: replica of the mobile Active Workout screen */}
        <HeroPreviewSection>
          <ActiveSessionMockup />
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


import { useEffect, useState, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { X, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { getWebTourSteps, type TourStep } from '../../constants/tourSteps';
import { markUserTourSeen } from '../../services/storage/tourStorage';

interface SpotlightTourProps {
  userId?: string | null;
  roleName?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

export function SpotlightTour({
  userId,
  roleName,
  isOpen,
  onClose,
}: SpotlightTourProps) {
  const { t } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  const steps: TourStep[] = useMemo(() => getWebTourSteps(roleName), [roleName]);
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Measure target DOM element
  const updateTargetRect = useCallback(() => {
    if (!currentStep) return;
    const element =
      document.querySelector(currentStep.targetSelector) ||
      (currentStep.fallbackSelector
        ? document.querySelector(currentStep.fallbackSelector)
        : null);

    if (element) {
      element.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        right: rect.right,
        bottom: rect.bottom,
      });
    } else {
      setTargetRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!isOpen) return;
    updateTargetRect();

    const handleResize = () => updateTargetRect();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen, currentStepIndex, updateTargetRect]);

  const handleComplete = useCallback(() => {
    if (userId) {
      markUserTourSeen(userId);
    }
    onClose();
  }, [userId, onClose]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    handleComplete();
  };

  // Keyboard navigation (Escape to close, arrows to step)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFirstStep, isLastStep, handleComplete]);

  if (!isOpen || !currentStep) return null;

  const pad = 8;
  const cardWidth = 360;

  // Compute card position based on target and placement
  let cardTop = 100;
  let cardLeft = 100;

  if (targetRect) {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    if (currentStep.placement === 'bottom') {
      cardTop = targetRect.bottom + 16;
      cardLeft = Math.max(16, Math.min(windowWidth - cardWidth - 16, targetRect.left));
      if (cardTop + 240 > windowHeight) {
        cardTop = Math.max(16, targetRect.top - 250);
      }
    } else {
      // Default: 'right' placement
      cardLeft = targetRect.right + 20;
      cardTop = Math.max(20, Math.min(windowHeight - 260, targetRect.top - 10));

      // If overflowing right, place to the left or below
      if (cardLeft + cardWidth > windowWidth - 16) {
        if (targetRect.left - cardWidth - 20 > 16) {
          cardLeft = targetRect.left - cardWidth - 20;
        } else {
          cardLeft = Math.max(16, (windowWidth - cardWidth) / 2);
          cardTop = targetRect.bottom + 20;
        }
      }
    }
  } else {
    // Center modal if target not present
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    cardLeft = Math.max(16, (windowWidth - cardWidth) / 2);
    cardTop = Math.max(20, (windowHeight - 240) / 2);
  }

  return (
    <OverlayContainer data-testid="spotlight-tour">
      <MaskSvg>
        <defs>
          <mask id="spotlight-cutout">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - pad}
                y={targetRect.top - pad}
                width={targetRect.width + pad * 2}
                height={targetRect.height + pad * 2}
                rx="10"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(6, 8, 18, 0.78)"
          mask="url(#spotlight-cutout)"
        />
      </MaskSvg>

      {targetRect && (
        <GlowingHole
          style={{
            top: targetRect.top - pad,
            left: targetRect.left - pad,
            width: targetRect.width + pad * 2,
            height: targetRect.height + pad * 2,
          }}
        />
      )}

      <TooltipCard
        data-testid="tour-card"
        style={{
          top: cardTop,
          left: cardLeft,
        }}
      >
        <CardHeader>
          <Badge data-testid="tour-step-counter">
            <Sparkles size={13} />
            <span>
              {t('tour.stepCounter', {
                current: currentStepIndex + 1,
                total: steps.length,
              })}
            </span>
          </Badge>
          <SkipBtn
            type="button"
            onClick={handleSkip}
            data-testid="tour-skip-btn"
            aria-label={t('tour.skip')}
          >
            <X size={16} />
          </SkipBtn>
        </CardHeader>

        <CardBody>
          <Title>{t(currentStep.titleKey)}</Title>
          <Description>{t(currentStep.descriptionKey)}</Description>
        </CardBody>

        <CardFooter>
          <DotsContainer>
            {steps.map((s, idx) => (
              <Dot
                key={s.id}
                $active={idx === currentStepIndex}
                $completed={idx < currentStepIndex}
                onClick={() => setCurrentStepIndex(idx)}
                aria-label={`Step ${idx + 1}`}
              />
            ))}
          </DotsContainer>

          <ButtonRow>
            {!isFirstStep && (
              <BackBtn
                type="button"
                onClick={handleBack}
                data-testid="tour-back-btn"
              >
                <ChevronLeft size={16} />
                <span>{t('common.back')}</span>
              </BackBtn>
            )}
            <NextBtn
              type="button"
              onClick={handleNext}
              data-testid="tour-next-btn"
            >
              <span>{isLastStep ? t('tour.finish') : t('common.next')}</span>
              {isLastStep ? <Check size={16} /> : <ChevronRight size={16} />}
            </NextBtn>
          </ButtonRow>
        </CardFooter>
      </TooltipCard>
    </OverlayContainer>
  );
}

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(239, 35, 60, 0.45);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(239, 35, 60, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 35, 60, 0);
  }
`;

const OverlayContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  pointer-events: auto;
`;

const MaskSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: auto;
`;

const GlowingHole = styled.div`
  position: fixed;
  border-radius: 10px;
  border: 2px solid #ef233c;
  pointer-events: none;
  animation: ${pulseGlow} 2s infinite ease-in-out;
  box-shadow: 0 0 16px rgba(239, 35, 60, 0.4);
`;

const TooltipCard = styled.div`
  position: fixed;
  width: 360px;
  max-width: calc(100vw - 32px);
  background: #111425;
  border: 1px solid rgba(239, 35, 60, 0.35);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6), 0 0 24px rgba(239, 35, 60, 0.15);
  border-radius: 1rem;
  padding: 1.25rem;
  color: #f7f7ff;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  z-index: 100000;
  transition: top 200ms ease, left 200ms ease;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(239, 35, 60, 0.16);
  border: 1px solid rgba(239, 35, 60, 0.4);
  color: #ff8a93;
  padding: 0.25rem 0.65rem;
  border-radius: 2rem;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  svg {
    color: #ef233c;
  }
`;

const SkipBtn = styled.button`
  background: transparent;
  border: none;
  color: #8f95b2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 0.4rem;
  transition: all 120ms ease;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.45;
  color: #c0c5e4;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.35rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const Dot = styled.button<{ $active: boolean; $completed: boolean }>`
  width: ${({ $active }) => ($active ? '1.25rem' : '0.45rem')};
  height: 0.45rem;
  border-radius: 1rem;
  border: none;
  background: ${({ $active, $completed }) =>
    $active
      ? '#ef233c'
      : $completed
        ? 'rgba(239, 35, 60, 0.5)'
        : 'rgba(255, 255, 255, 0.2)'};
  cursor: pointer;
  padding: 0;
  transition: all 150ms ease;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  color: #cfd4ef;
  padding: 0.4rem 0.75rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 120ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #ffffff;
  }
`;

const NextBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: linear-gradient(135deg, #ef233c 0%, #d90429 100%);
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
  padding: 0.42rem 0.95rem;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(239, 35, 60, 0.35);
  transition: all 120ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(239, 35, 60, 0.45);
  }
`;

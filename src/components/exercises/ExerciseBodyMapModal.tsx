import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ExerciseBodyMap } from './ExerciseBodyMap';

type ExerciseBodyMapModalProps = {
  isOpen: boolean;
  exerciseName: string;
  primary: string;
  secondary: string;
  stabilizers: string;
  onClose: () => void;
};

/** Focused overlay used to inspect an exercise's anatomical activation map. */
export function ExerciseBodyMapModal({
  isOpen,
  exerciseName,
  primary,
  secondary,
  stabilizers,
  onClose,
}: ExerciseBodyMapModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay role="presentation" onMouseDown={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-body-map-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Header>
          <div>
            <Title id="exercise-body-map-title">{t('exercises.bodyMapTitle')}</Title>
            <Description>{exerciseName}</Description>
          </div>
          <CloseButton
            type="button"
            aria-label={t('exercises.closeBodyMap')}
            onClick={onClose}
          >
            <X size={18} aria-hidden />
          </CloseButton>
        </Header>
        <ExerciseBodyMap
          primary={primary}
          secondary={secondary}
          stabilizers={stabilizers}
        />
      </Dialog>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: rgba(16, 18, 37, 0.82);
  backdrop-filter: blur(24px);
`;

const Dialog = styled.div`
  width: min(100%, 42rem);
  max-height: min(92vh, 54rem);
  overflow: auto;
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(255, 179, 177, 0.12), transparent 16rem),
    #1c1e32;
  padding: 1.5rem;
  color: #f7f7ff;
  box-shadow: 0 48px 70px -48px rgba(0, 0, 0, 0.95);
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  color: #f7f7ff;
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: -0.03em;
`;

const Description = styled.p`
  margin: 0.35rem 0 0;
  color: #e7bdbb;
  font-size: 0.85rem;
`;

const CloseButton = styled.button`
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 auto;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: #313349;
  color: #ffdad6;
  cursor: pointer;
`;

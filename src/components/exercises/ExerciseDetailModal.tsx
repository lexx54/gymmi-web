import { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon, Play, Scan } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Modal } from '../common/Modal';
import { ExerciseBodyMapModal } from './ExerciseBodyMapModal';
import {
  resolveLocalizedText,
  type Exercise,
  type LocalizedText,
} from '../../services/api/exercises';

type ExerciseDetailModalProps = {
  exercise: Exercise | null;
  onClose: () => void;
};

const MEDIA_SLIDES = ['front', 'side', 'video'] as const;

/**
 * Read-only exercise detail overlay. Media is a local carousel mock until
 * image/video upload is wired to the API.
 */
export function ExerciseDetailModal({ exercise, onClose }: ExerciseDetailModalProps) {
  const { t, i18n } = useTranslation();
  const [slideIndex, setSlideIndex] = useState(0);
  const [bodyMapOpen, setBodyMapOpen] = useState(false);

  const slide = MEDIA_SLIDES[slideIndex];
  const isVideo = slide === 'video';
  const language = i18n.resolvedLanguage ?? i18n.language;
  const localized = (value: LocalizedText | string | null | undefined) =>
    resolveLocalizedText(value, language) || t('exercises.noMovementType');
  const closeModal = () => {
    setSlideIndex(0);
    setBodyMapOpen(false);
    onClose();
  };

  return (
    <Modal
      isOpen={Boolean(exercise)}
      title={exercise?.name ?? ''}
      description={exercise ? t('exercises.detailDescription') : undefined}
      size="wide"
      onClose={closeModal}
    >
      {exercise ? (
        <>
          <Content>
          <Carousel aria-roledescription="carousel" aria-label={t('exercises.mediaCarousel')}>
            <Slide>
              {isVideo ? <Play size={42} aria-hidden /> : <ImageIcon size={42} aria-hidden />}
              <SlideLabel>{t(`exercises.mediaSlide.${slide}`)}</SlideLabel>
              <ComingSoon>{t('exercises.mediaComingSoon')}</ComingSoon>
            </Slide>
            <CarouselControls>
              <CarouselButton
                type="button"
                aria-label={t('exercises.previousMedia')}
                onClick={() =>
                  setSlideIndex((value) =>
                    value === 0 ? MEDIA_SLIDES.length - 1 : value - 1,
                  )
                }
              >
                <ChevronLeft size={18} aria-hidden />
              </CarouselButton>
              <Dots>
                {MEDIA_SLIDES.map((id, index) => (
                  <Dot
                    key={id}
                    type="button"
                    $active={index === slideIndex}
                    aria-label={t('exercises.mediaSlideDot', {
                      current: index + 1,
                      total: MEDIA_SLIDES.length,
                    })}
                    aria-current={index === slideIndex}
                    onClick={() => setSlideIndex(index)}
                  />
                ))}
              </Dots>
              <CarouselButton
                type="button"
                aria-label={t('exercises.nextMedia')}
                onClick={() =>
                  setSlideIndex((value) =>
                    value === MEDIA_SLIDES.length - 1 ? 0 : value + 1,
                  )
                }
              >
                <ChevronRight size={18} aria-hidden />
              </CarouselButton>
            </CarouselControls>
          </Carousel>

          <MetaGrid>
            <Field>
              <FieldLabel>{t('exercises.targetMuscle')}</FieldLabel>
              <FieldValue>{localized(exercise.targetMuscle)}</FieldValue>
            </Field>
            <Field>
              <FieldLabel>{t('exercises.equipmentRequired')}</FieldLabel>
              <FieldValue>{localized(exercise.equipment)}</FieldValue>
            </Field>
            <Field>
              <FieldLabel>{t('exercises.difficulty')}</FieldLabel>
              <FieldValue>{exercise.difficulty}</FieldValue>
            </Field>
            <Field>
              <FieldLabel>{t('exercises.movementType')}</FieldLabel>
              <FieldValue>{exercise.movementType ?? t('exercises.noMovementType')}</FieldValue>
            </Field>
          </MetaGrid>

          <Field>
            <ActivationHeader>
              <FieldLabel>{t('exercises.activationMap')}</FieldLabel>
              <BodyMapButton type="button" onClick={() => setBodyMapOpen(true)}>
                <Scan size={15} aria-hidden />
                {t('exercises.viewBodyMap')}
              </BodyMapButton>
            </ActivationHeader>
            <ActivationGrid>
              <ActivationTile $tier="principal">
                <ActivationLabel>{t('exercises.primary')}</ActivationLabel>
                <ActivationValue>
                  {localized(exercise.activationMap.principal)}
                </ActivationValue>
              </ActivationTile>
              <ActivationTile $tier="secondary">
                <ActivationLabel>{t('exercises.secondary')}</ActivationLabel>
                <ActivationValue>
                  {localized(exercise.activationMap.secondary)}
                </ActivationValue>
              </ActivationTile>
              <ActivationTile $tier="stabilizers">
                <ActivationLabel>{t('exercises.stabilizers')}</ActivationLabel>
                <ActivationValue>
                  {localized(exercise.activationMap.stabilizers)}
                </ActivationValue>
              </ActivationTile>
            </ActivationGrid>
          </Field>

          <Field>
            <FieldLabel>{t('exercises.detailedInstructions')}</FieldLabel>
            <Instructions>{localized(exercise.instructions)}</Instructions>
          </Field>

          {exercise.tags.length > 0 ? (
            <Field>
              <FieldLabel>{t('exercises.metadataTags')}</FieldLabel>
              <Tags>
                {exercise.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Tags>
            </Field>
          ) : null}
          </Content>
          <ExerciseBodyMapModal
            isOpen={bodyMapOpen}
            exerciseName={exercise.name}
            primary={resolveLocalizedText(exercise.activationMap.principal, 'en')}
            secondary={resolveLocalizedText(exercise.activationMap.secondary, 'en')}
            stabilizers={resolveLocalizedText(exercise.activationMap.stabilizers, 'en')}
            onClose={() => setBodyMapOpen(false)}
          />
        </>
      ) : null}
    </Modal>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.25rem;
`;

const Carousel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const Slide = styled.div`
  display: grid;
  min-height: 14rem;
  place-items: center;
  gap: 0.45rem;
  border-radius: 1.15rem;
  border: 1px dashed #3a3d59;
  background:
    linear-gradient(180deg, rgba(255, 179, 177, 0.08), transparent 55%),
    #181a2e;
  color: #ffb3b1;
  text-align: center;
  padding: 1.5rem;
`;

const SlideLabel = styled.p`
  margin: 0;
  color: #f7f7ff;
  font-size: 0.95rem;
  font-weight: 800;
`;

const ComingSoon = styled.p`
  margin: 0;
  color: #e7bdbb;
  font-size: 0.8rem;
`;

const CarouselControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
`;

const CarouselButton = styled.button`
  display: grid;
  width: 2.15rem;
  height: 2.15rem;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: #313349;
  color: #ffdad6;
  cursor: pointer;
`;

const Dots = styled.div`
  display: flex;
  gap: 0.45rem;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 0.55rem;
  height: 0.55rem;
  border: 0;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#ffb3b1' : '#4a4d66')};
  cursor: pointer;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem 1.25rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ActivationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.35rem;
`;

const BodyMapButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid #5d3f3e;
  border-radius: 999px;
  background: #26283d;
  color: #ffb3b1;
  padding: 0.45rem 0.75rem;
  font-size: 0.68rem;
  font-weight: 800;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #ffb3b1;
    outline-offset: 2px;
  }
`;

const ActivationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ActivationTile = styled.div<{
  $tier: 'principal' | 'secondary' | 'stabilizers';
}>`
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  background: #181a2e;
  padding: 0.9rem 1rem;

  &::before {
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: ${({ $tier }) => {
      if ($tier === 'principal') return '#ff535a';
      if ($tier === 'secondary') return '#bbc7dd';
      return '#5d3f3e';
    }};
    content: '';
  }
`;

const ActivationLabel = styled.p`
  margin: 0 0 0.4rem;
  color: #e7bdbb;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const ActivationValue = styled.p`
  margin: 0;
  color: #f7f7ff;
  font-size: 0.9rem;
  font-weight: 800;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const FieldLabel = styled.p`
  margin: 0;
  color: #ffb3b1;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const FieldValue = styled.p`
  margin: 0;
  color: #f7f7ff;
  font-size: 0.95rem;
  font-weight: 700;
`;

const Instructions = styled.p`
  margin: 0;
  color: #e7bdbb;
  font-size: 0.92rem;
  line-height: 1.55;
  white-space: pre-wrap;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.55rem;
  border-radius: 9999px;
  background-color: #26283d;
  color: #e0e0fc;
  font-size: 0.7rem;
  font-weight: 700;
`;

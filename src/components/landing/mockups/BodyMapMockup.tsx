import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';
import { ExerciseBodyMap } from '../../exercises/ExerciseBodyMap';
import type { ExerciseBodyActivations } from '../../exercises/exerciseBodyMapUtils';
import { MOCK, WebBody, WebFrame, WebTitle, WebTopBar, pickLang } from './mockupStyles';

type DemoExercise = {
  id: string;
  name: { en: string; es: string };
  muscleKey: 'chest' | 'legs' | 'back';
  equipmentKey: 'barbell' | 'cable';
  activations: ExerciseBodyActivations;
};

/** Muscle names must match the real `ExerciseBodyMap` regions. */
const EXERCISES: DemoExercise[] = [
  {
    id: 'bench',
    name: { en: 'Barbell Bench Press', es: 'Press de banca con barra' },
    muscleKey: 'chest',
    equipmentKey: 'barbell',
    activations: { primary: 'Chest', secondary: 'Shoulders', stabilizers: 'Rectus Abdominis' },
  },
  {
    id: 'squat',
    name: { en: 'Barbell Back Squat', es: 'Sentadilla trasera con barra' },
    muscleKey: 'legs',
    equipmentKey: 'barbell',
    activations: { primary: 'Quads', secondary: 'Glutes', stabilizers: 'Back' },
  },
  {
    id: 'rdl',
    name: { en: 'Romanian Deadlift', es: 'Peso muerto rumano' },
    muscleKey: 'legs',
    equipmentKey: 'barbell',
    activations: { primary: 'Hamstrings', secondary: 'Glutes', stabilizers: 'Forearms' },
  },
  {
    id: 'pulldown',
    name: { en: 'Lat Pulldown', es: 'Jalón al pecho' },
    muscleKey: 'back',
    equipmentKey: 'cable',
    activations: { primary: 'Back', secondary: 'Forearms', stabilizers: 'Rectus Abdominis' },
  },
];

/** Mirrors the web exercise catalog filters + the read-only body map in `ExerciseDetailModal`. */
export function BodyMapMockup() {
  const { t, i18n } = useTranslation();
  const [selectedId, setSelectedId] = useState('bench');
  const selected = EXERCISES.find((e) => e.id === selectedId) ?? EXERCISES[0];

  const filters = [
    { label: t('landing.mock.filterMuscle'), value: t(`landing.mock.${selected.muscleKey}`) },
    { label: t('landing.mock.filterEquipment'), value: t(`landing.mock.${selected.equipmentKey}`) },
    { label: t('landing.mock.filterLevel'), value: t('landing.mock.intermediate') },
  ];

  return (
    <WebFrame data-testid="body-map-mockup">
      <WebTopBar>
        <WebTitle>{t('landing.mock.exerciseCatalog')}</WebTitle>
      </WebTopBar>
      <WebBody>
        <Filters>
          {filters.map((f) => (
            <FakeSelect key={f.label}>
              <small>{f.label}</small>
              <span>
                {f.value} <ChevronDown size={11} />
              </span>
            </FakeSelect>
          ))}
        </Filters>

        <ExerciseGrid>
          {EXERCISES.map((ex) => (
            <ExerciseButton
              key={ex.id}
              type="button"
              aria-pressed={ex.id === selectedId}
              $selected={ex.id === selectedId}
              onClick={() => setSelectedId(ex.id)}
            >
              {pickLang(i18n.language, ex.name)}
            </ExerciseButton>
          ))}
        </ExerciseGrid>

        <MapWrap>
          <ExerciseBodyMap {...selected.activations} />
        </MapWrap>
      </WebBody>
    </WebFrame>
  );
}

const Filters = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.4rem;
`;

const FakeSelect = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.35rem 0.55rem;
  border-radius: 0.55rem;
  background: ${MOCK.cardLow};
  border: 1px solid rgba(255, 255, 255, 0.07);
  small {
    font-size: 0.55rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${MOCK.muted};
  }
  span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.72rem;
    font-weight: 700;
    color: ${MOCK.white};
  }
`;

const ExerciseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
`;

const ExerciseButton = styled.button<{ $selected: boolean }>`
  padding: 0.5rem 0.6rem;
  border-radius: 0.6rem;
  border: 1px solid ${({ $selected }) => ($selected ? MOCK.red : 'rgba(255,255,255,0.08)')};
  background: ${({ $selected }) => ($selected ? 'rgba(239,35,60,0.14)' : MOCK.cardLow)};
  color: ${({ $selected }) => ($selected ? '#fff' : MOCK.text)};
  font-size: 0.7rem;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
`;

const MapWrap = styled.div`
  svg {
    height: 13rem;
  }
`;

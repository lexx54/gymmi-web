import type { ChangeEvent } from 'react';
import styled from 'styled-components';
import type { ListCatalogItem } from '../../hooks/useListData';

type ActivationTier = 'primary' | 'secondary' | 'stabilizers';

type ActivationEntry = {
  id: ActivationTier;
  label: string;
  value: string;
};

const FALLBACK_MUSCLE_NAMES = ['Quads', 'Hamstrings', 'Chest', 'Back', 'Shoulders'];

export function buildActivations(muscles: ListCatalogItem[], targetMuscle: string): ActivationEntry[] {
  if (muscles.length === 0) {
    return [
      { id: 'primary', label: 'Primary', value: targetMuscle },
      { id: 'secondary', label: 'Secondary', value: 'Glutes' },
      { id: 'stabilizers', label: 'Stabilizers', value: 'Core' },
    ];
  }

  const primaryMeta = muscles.find((m) => m.name === targetMuscle);
  const primaryType = primaryMeta?.type;

  const sameTypeOthers = muscles.filter((m) => m.type === primaryType && m.name !== targetMuscle);
  const secondaryName =
    sameTypeOthers[0]?.name ?? muscles.find((m) => m.name !== targetMuscle)?.name ?? targetMuscle;

  const stabilizerCandidate = muscles.find(
    (m) =>
      m.name !== targetMuscle &&
      m.name !== secondaryName &&
      (primaryType === undefined || m.type !== primaryType),
  );
  const stabilizersName =
    stabilizerCandidate?.name ??
    muscles.find((m) => m.name !== targetMuscle && m.name !== secondaryName)?.name ??
    'Core';

  return [
    { id: 'primary', label: 'Primary', value: targetMuscle },
    { id: 'secondary', label: 'Secondary', value: secondaryName },
    { id: 'stabilizers', label: 'Stabilizers', value: stabilizersName },
  ];
}

export function suggestSecondaryStabilizers(
  muscles: ListCatalogItem[],
  targetMuscle: string,
): { secondary: string; stabilizers: string } {
  const entries = buildActivations(muscles, targetMuscle);
  return {
    secondary: entries.find((e) => e.id === 'secondary')!.value,
    stabilizers: entries.find((e) => e.id === 'stabilizers')!.value,
  };
}

function muscleSelectOptions(apiNames: string[], primary: string, secondary: string, stabilizers: string): string[] {
  const base = apiNames.length > 0 ? apiNames : FALLBACK_MUSCLE_NAMES;
  const out = [...base];
  for (const v of [primary, secondary, stabilizers]) {
    if (v && !out.includes(v)) out.push(v);
  }
  return out;
}

type ActivationMapCardProps = {
  muscleNames: string[];
  primary: string;
  secondary: string;
  stabilizers: string;
  onPrimaryChange: (name: string) => void;
  onSecondaryChange: (name: string) => void;
  onStabilizersChange: (name: string) => void;
};

const TIERS: { id: ActivationTier; label: string }[] = [
  { id: 'primary', label: 'Primary' },
  { id: 'secondary', label: 'Secondary' },
  { id: 'stabilizers', label: 'Stabilizers' },
];

/**
 * Shows the muscle activation map for the exercise with tonal accent bars.
 */
export function ActivationMapCard({
  muscleNames,
  primary,
  secondary,
  stabilizers,
  onPrimaryChange,
  onSecondaryChange,
  onStabilizersChange,
}: ActivationMapCardProps) {
  const options = muscleSelectOptions(muscleNames, primary, secondary, stabilizers);

  const valueFor = (id: ActivationTier) => {
    if (id === 'primary') return primary;
    if (id === 'secondary') return secondary;
    return stabilizers;
  };

  const onChangeFor = (id: ActivationTier) => (event: ChangeEvent<HTMLSelectElement>) => {
    const v = event.target.value;
    if (id === 'primary') onPrimaryChange(v);
    else if (id === 'secondary') onSecondaryChange(v);
    else onStabilizersChange(v);
  };

  return (
    <Card>
      <Title>Activation Map</Title>
      <Grid>
        {TIERS.map((tier) => (
          <Tile key={tier.id} $tier={tier.id}>
            <TileLabel htmlFor={`activation-${tier.id}`}>{tier.label}</TileLabel>
            <MuscleSelect
              id={`activation-${tier.id}`}
              value={valueFor(tier.id)}
              onChange={onChangeFor(tier.id)}
              aria-label={`${tier.label} muscle`}
            >
              {options.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </MuscleSelect>
          </Tile>
        ))}
      </Grid>
    </Card>
  );
}

const Card = styled.section`
  background-color: #181a2e;
  border-radius: 0.85rem;
  padding: 2rem;
`;

const Title = styled.h4`
  margin: 0 0 1.75rem;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
`;

const Tile = styled.div<{ $tier: ActivationTier }>`
  position: relative;
  background-color: #1c1e32;
  border-radius: 0.75rem;
  padding: 1.15rem 1.35rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${({ $tier }) => {
      if ($tier === 'primary') return '#ff535a';
      if ($tier === 'secondary') return '#bbc7dd';
      return 'rgba(93, 63, 62, 0.35)';
    }};
  }
`;

const TileLabel = styled.label`
  display: block;
  margin: 0 0 0.45rem;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const MuscleSelect = styled.select`
  width: 100%;
  margin: 0;
  background-color: #181a2e;
  border: none;
  border-radius: 0.45rem;
  color: #e0e0fc;
  padding: 0.55rem 0.4rem;
  font-size: 1.05rem;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  transition: box-shadow 150ms ease;

  &:focus {
    box-shadow: 0 0 0 2px #ffb3b1;
  }
`;

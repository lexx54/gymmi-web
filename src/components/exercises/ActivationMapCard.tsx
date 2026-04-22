import styled from 'styled-components';

type ActivationTier = 'primary' | 'secondary' | 'stabilizers';

type ActivationEntry = {
  id: ActivationTier;
  label: string;
  value: string;
};

const DEFAULT_ACTIVATIONS: ActivationEntry[] = [
  { id: 'primary', label: 'Primary', value: 'Quadriceps' },
  { id: 'secondary', label: 'Secondary', value: 'Glutes' },
  { id: 'stabilizers', label: 'Stabilizers', value: 'Core' },
];

/**
 * Shows the muscle activation map for the exercise with tonal accent bars.
 */
export function ActivationMapCard() {
  return (
    <Card>
      <Title>Activation Map</Title>
      <Grid>
        {DEFAULT_ACTIVATIONS.map((entry) => (
          <Tile key={entry.id} $tier={entry.id}>
            <TileLabel>{entry.label}</TileLabel>
            <TileValue>{entry.value}</TileValue>
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

const TileLabel = styled.p`
  margin: 0 0 0.3rem;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const TileValue = styled.p`
  margin: 0;
  color: #e0e0fc;
  font-size: 1.2rem;
  font-weight: 700;
`;

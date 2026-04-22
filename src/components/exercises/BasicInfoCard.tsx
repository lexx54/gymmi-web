import styled from 'styled-components';
import type { Equipment, TargetMuscle } from './types';

const TARGET_MUSCLES: TargetMuscle[] = ['Quads', 'Hamstrings', 'Chest', 'Back', 'Shoulders'];
const EQUIPMENT: Equipment[] = ['Dumbbells', 'Barbell', 'Cable Machine', 'Kettlebell', 'Bodyweight'];

type BasicInfoCardProps = {
  name: string;
  targetMuscle: TargetMuscle;
  equipment: Equipment;
  onNameChange: (value: string) => void;
  onTargetMuscleChange: (value: TargetMuscle) => void;
  onEquipmentChange: (value: Equipment) => void;
};

/**
 * Primary exercise details: name, target muscle group, and equipment.
 */
export function BasicInfoCard({
  name,
  targetMuscle,
  equipment,
  onNameChange,
  onTargetMuscleChange,
  onEquipmentChange,
}: BasicInfoCardProps) {
  return (
    <Card>
      <AccentBar />
      <Grid>
        <FullRow>
          <FieldLabel htmlFor="exercise-name">Exercise Name</FieldLabel>
          <NameInput
            id="exercise-name"
            type="text"
            placeholder="e.g. Bulgarian Split Squat"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
          />
        </FullRow>
        <div>
          <FieldLabel htmlFor="target-muscle">Target Muscle Group</FieldLabel>
          <Select
            id="target-muscle"
            value={targetMuscle}
            onChange={(event) => onTargetMuscleChange(event.target.value as TargetMuscle)}
          >
            {TARGET_MUSCLES.map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="equipment">Equipment Required</FieldLabel>
          <Select
            id="equipment"
            value={equipment}
            onChange={(event) => onEquipmentChange(event.target.value as Equipment)}
          >
            {EQUIPMENT.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
      </Grid>
    </Card>
  );
}

const Card = styled.section`
  position: relative;
  background-color: #181a2e;
  border-radius: 0.85rem;
  padding: 2rem;
  overflow: hidden;
`;

const AccentBar = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #ffb3b1;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
`;

const FullRow = styled.div`
  grid-column: span 2;
`;

const FieldLabel = styled.label`
  display: block;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.62rem;
  font-weight: 700;
  margin-bottom: 0.85rem;
`;

const NameInput = styled.input`
  width: 100%;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #e0e0fc;
  font-size: 1.55rem;
  font-weight: 700;
  padding: 0.65rem 0;
  outline: none;
  transition: border-color 150ms ease;

  &::placeholder {
    color: #313349;
  }

  &:focus {
    border-bottom-color: #ffb3b1;
  }
`;

const Select = styled.select`
  width: 100%;
  background-color: #1c1e32;
  border: none;
  border-radius: 0.55rem;
  color: #e0e0fc;
  padding: 0.95rem 1rem;
  font-size: 0.9rem;
  outline: none;
  transition: box-shadow 150ms ease;

  &:focus {
    box-shadow: 0 0 0 2px #ffb3b1;
  }
`;

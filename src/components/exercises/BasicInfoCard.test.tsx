import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BasicInfoCard } from './BasicInfoCard';

describe('BasicInfoCard', () => {
  const defaultProps = {
    name: 'Bulgarian Split Squat',
    targetMuscle: 'Quads' as const,
    equipment: 'Dumbbells',
    onNameChange: vi.fn(),
    onTargetMuscleChange: vi.fn(),
    onEquipmentChange: vi.fn(),
  };

  it('renders input with provided name value', () => {
    render(<BasicInfoCard {...defaultProps} />);

    expect(screen.getByDisplayValue('Bulgarian Split Squat')).toBeInTheDocument();
  });

  it('renders select with provided targetMuscle value', () => {
    render(<BasicInfoCard {...defaultProps} />);

    const select = screen.getByLabelText(/target muscle group/i);
    expect(select).toHaveValue('Quads');
  });

  it('renders select with provided equipment value', () => {
    render(<BasicInfoCard {...defaultProps} />);

    const select = screen.getByLabelText(/equipment required/i);
    expect(select).toHaveValue('Dumbbells');
  });

  it('calls onNameChange when typing in input', () => {
    const onNameChange = vi.fn();
    render(<BasicInfoCard {...defaultProps} onNameChange={onNameChange} />);

    fireEvent.change(screen.getByDisplayValue('Bulgarian Split Squat'), {
      target: { value: 'Bench Press' },
    });

    expect(onNameChange).toHaveBeenCalledWith('Bench Press');
  });

  it('calls onTargetMuscleChange when selecting a muscle group', () => {
    const onTargetMuscleChange = vi.fn();
    render(<BasicInfoCard {...defaultProps} onTargetMuscleChange={onTargetMuscleChange} />);

    fireEvent.change(screen.getByLabelText(/target muscle group/i), {
      target: { value: 'Chest' },
    });

    expect(onTargetMuscleChange).toHaveBeenCalledWith('Chest');
  });

  it('calls onEquipmentChange when selecting equipment', () => {
    const onEquipmentChange = vi.fn();
    render(<BasicInfoCard {...defaultProps} onEquipmentChange={onEquipmentChange} />);

    fireEvent.change(screen.getByLabelText(/equipment required/i), {
      target: { value: 'Barbell' },
    });

    expect(onEquipmentChange).toHaveBeenCalledWith('Barbell');
  });

  it('uses custom equipmentOptions when provided', () => {
    render(
      <BasicInfoCard
        {...defaultProps}
        equipmentOptions={['Resistance Band', 'Medicine Ball']}
      />,
    );

    expect(screen.getByText('Resistance Band')).toBeInTheDocument();
    expect(screen.getByText('Medicine Ball')).toBeInTheDocument();
    expect(screen.queryByText('Barbell')).not.toBeInTheDocument();
  });

  it('uses custom targetMuscleOptions when provided', () => {
    render(
      <BasicInfoCard
        {...defaultProps}
        targetMuscleOptions={['Biceps', 'Triceps', 'Forearms']}
      />,
    );

    expect(screen.getByText('Biceps')).toBeInTheDocument();
    expect(screen.getByText('Triceps')).toBeInTheDocument();
    expect(screen.queryByText('Hamstrings')).not.toBeInTheDocument();
  });
});

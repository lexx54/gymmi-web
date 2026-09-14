import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ExerciseCard } from './ExerciseCard';

const exercise = {
  id: 'routine-exercise',
  exerciseId: 'exercise',
  name: 'Incline Bench Press',
  target: 'Chest',
  supersetColor: '#ff535a' as const,
  sets: [{ id: 'set', weight: 80, reps: 10, restSeconds: 90, rpe: 8 }],
};

describe('ExerciseCard', () => {
  it('renders editable set controls and emits rest changes', () => {
    const onUpdateSet = vi.fn();
    const { container } = render(
      <ExerciseCard
        exercise={exercise}
        position={1}
        onAddSet={vi.fn()}
        onRemoveSet={vi.fn()}
        onRemoveExercise={vi.fn()}
        onUpdateSet={onUpdateSet}
        onMove={vi.fn()}
        onSupersetChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('Set 1 rest seconds'), { target: { value: '120' } });
    expect(onUpdateSet).toHaveBeenCalledWith('set', 'restSeconds', 120);
    expect(container).toMatchSnapshot();
  });

  it('offers a default add-set action and a copy of the last set', () => {
    const onAddSet = vi.fn();
    const onAddSetFromLast = vi.fn();
    render(
      <ExerciseCard
        exercise={exercise}
        position={1}
        onAddSet={onAddSet}
        onAddSetFromLast={onAddSetFromLast}
        onRemoveSet={vi.fn()}
        onRemoveExercise={vi.fn()}
        onUpdateSet={vi.fn()}
        onMove={vi.fn()}
        onSupersetChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add Set' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add set from last' }));
    expect(onAddSet).toHaveBeenCalledTimes(1);
    expect(onAddSetFromLast).toHaveBeenCalledTimes(1);
  });

  it('hides creator controls in read-only state', () => {
    render(
      <ExerciseCard
        exercise={exercise}
        position={1}
        onAddSet={vi.fn()}
        onRemoveSet={vi.fn()}
        onRemoveExercise={vi.fn()}
        onUpdateSet={vi.fn()}
        onMove={vi.fn()}
        onSupersetChange={vi.fn()}
        readOnly
      />,
    );

    expect(screen.queryByRole('button', { name: /remove exercise/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Set 1 weight')).toBeDisabled();
  });
});

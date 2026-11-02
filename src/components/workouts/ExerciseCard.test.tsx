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
        onAddSets={vi.fn()}
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

  it('adds one, two, three or four sets', () => {
    const onAddSets = vi.fn();
    render(
      <ExerciseCard
        exercise={exercise}
        position={1}
        onAddSets={onAddSets}
        onRemoveSet={vi.fn()}
        onRemoveExercise={vi.fn()}
        onUpdateSet={vi.fn()}
        onMove={vi.fn()}
        onSupersetChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add Set' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add 2 sets' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add 4 sets' }));
    expect(onAddSets.mock.calls).toEqual([[1], [2], [4]]);
    expect(screen.queryByRole('button', { name: 'Add set from last' })).not.toBeInTheDocument();
  });

  it('disables batches that would pass six sets and shows the limit', () => {
    const fourSets = {
      ...exercise,
      sets: Array.from({ length: 4 }, (_, index) => ({ ...exercise.sets[0], id: `set-${index}` })),
    };
    const { rerender } = render(
      <ExerciseCard
        exercise={fourSets}
        position={1}
        onAddSets={vi.fn()}
        onRemoveSet={vi.fn()}
        onRemoveExercise={vi.fn()}
        onUpdateSet={vi.fn()}
        onMove={vi.fn()}
        onSupersetChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Add 2 sets' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Add 3 sets' })).toBeDisabled();
    expect(screen.queryByText('6 sets max')).not.toBeInTheDocument();

    const sixSets = {
      ...exercise,
      sets: Array.from({ length: 6 }, (_, index) => ({ ...exercise.sets[0], id: `set-${index}` })),
    };
    rerender(
      <ExerciseCard
        exercise={sixSets}
        position={1}
        onAddSets={vi.fn()}
        onRemoveSet={vi.fn()}
        onRemoveExercise={vi.fn()}
        onUpdateSet={vi.fn()}
        onMove={vi.fn()}
        onSupersetChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Add Set' })).toBeDisabled();
    expect(screen.getByText('6 sets max')).toBeInTheDocument();
  });

  it('shows static set values in read-only state', () => {
    render(
      <ExerciseCard
        exercise={exercise}
        position={1}
        onAddSets={vi.fn()}
        onRemoveSet={vi.fn()}
        onRemoveExercise={vi.fn()}
        onUpdateSet={vi.fn()}
        onMove={vi.fn()}
        onSupersetChange={vi.fn()}
        readOnly
      />,
    );

    expect(screen.queryByRole('button', { name: /remove exercise/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Set 1 weight')).not.toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('marks superset membership with a numbered side tab', () => {
    const { rerender } = render(
      <ExerciseCard
        exercise={exercise}
        position={1}
        onAddSets={vi.fn()}
        onRemoveSet={vi.fn()}
        onRemoveExercise={vi.fn()}
        onUpdateSet={vi.fn()}
        onMove={vi.fn()}
        onSupersetChange={vi.fn()}
        readOnly
      />,
    );

    const tab = screen.getByTitle('Superset 1');
    expect(tab).toHaveTextContent('1');
    expect(tab).toHaveTextContent(/superset/i);

    rerender(
      <ExerciseCard
        exercise={{ ...exercise, supersetColor: null }}
        position={1}
        onAddSets={vi.fn()}
        onRemoveSet={vi.fn()}
        onRemoveExercise={vi.fn()}
        onUpdateSet={vi.fn()}
        onMove={vi.fn()}
        onSupersetChange={vi.fn()}
        readOnly
      />,
    );

    expect(screen.queryByTitle(/superset \d/i)).not.toBeInTheDocument();
  });
});

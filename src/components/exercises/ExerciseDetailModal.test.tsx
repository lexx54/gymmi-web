import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import type { Exercise } from '../../services/api/exercises';

const exercise: Exercise = {
  id: 'ex-1',
  name: 'Barbell Bench Press',
  targetMuscle: { en: 'Chest', es: 'Pecho' },
  equipment: { en: 'Barbell', es: 'Barra' },
  instructions: { en: 'Press the bar', es: 'Empuja la barra' },
  activationMap: {
    principal: { en: 'Chest', es: 'Pecho' },
    secondary: { en: 'Triceps', es: 'Tríceps' },
    stabilizers: { en: 'Shoulders', es: 'Hombros' },
  },
  difficulty: 'Intermediate',
  movementType: 'Compound',
  tags: [],
  images: ['https://cdn.gymmi.com/exercise-images/1.webp'],
  ownerId: null,
  gymId: null,
  createdAt: '',
  updatedAt: '',
};

describe('ExerciseDetailModal', () => {
  it('shows an edit action when onEdit is provided', () => {
    const onEdit = vi.fn();
    render(<ExerciseDetailModal exercise={exercise} onClose={vi.fn()} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole('button', { name: /edit exercise/i }));
    expect(onEdit).toHaveBeenCalled();
  });

  it('hides the edit action without onEdit', () => {
    render(<ExerciseDetailModal exercise={exercise} onClose={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /edit exercise/i })).not.toBeInTheDocument();
  });

  it('shows uploaded photos instead of placeholders', () => {
    render(<ExerciseDetailModal exercise={exercise} onClose={vi.fn()} />);

    expect(screen.getByAltText('Exercise photo 1 of 1')).toHaveAttribute(
      'src',
      'https://cdn.gymmi.com/exercise-images/1.webp',
    );
    expect(screen.queryByText('Photos and video coming soon')).not.toBeInTheDocument();
  });
});
